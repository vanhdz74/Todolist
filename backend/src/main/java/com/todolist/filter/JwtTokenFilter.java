package com.vihotask.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vihotask.components.JwtTokenUtil;
import com.vihotask.dto.ApiResponse;
import com.vihotask.entity.User;
import com.vihotask.enums.ErrorCode;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, // request hiện tại.
                                    @NonNull HttpServletResponse response, // response hiện tại.
                                    @NonNull FilterChain filterChain) // tiếp tục phần xử lý (controller, filter khác).

        // bắt/propagate IO và Servlet exceptions.
            throws ServletException, IOException {
        try {
            // Ktra request, nếu request “bỏ qua”, không cần kiểm tra JWT → cho đi luôn.
            if (isBypassToken(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Ktra respon kèm theo
            final String authHeader = request.getHeader("Authorization");
            // Check header có bị null hay ko có Bearer đầu
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                writeUnauthorizedResponse(response);
                return;
            }

            // Lấy token
            final String token = authHeader.substring(7);

            // Lấy email token
            final String email = jwtTokenUtil.extractEmail(token);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User userDetails = (User) userDetailsService.loadUserByUsername(email);

                // Check email của token và email lấy đc trong đb khi load
                if (jwtTokenUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null,
                                    userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }

            // Tiếp tục doFilter
            filterChain.doFilter(request, response); //enable bypass

        } catch (Exception e) {
            writeUnauthorizedResponse(response);
        }
    }

    private void writeUnauthorizedResponse(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(
                response.getWriter(),
                ApiResponse.error(ErrorCode.UNAUTHORIZED.getCode(), ErrorCode.UNAUTHORIZED.getMessage())
        );
    }

    // Xác định request hiện tại có phải isBypassToken
    // kiểm tra xem request hiện tại có nằm trong danh sách “bỏ qua xác thực JWT” không.
    private boolean isBypassToken(@NonNull HttpServletRequest request) {
        final List<Pair<String, String>> bypassTokens = Arrays.asList(
                Pair.of("/register", "POST"),
                Pair.of("/login", "POST"),
                Pair.of("/refresh", "POST")
        );

        // first: đường dẫn API
        // second: method HTTP
        for (Pair<String, String> bypassToken : bypassTokens) {
            if (request.getRequestURI().contains(bypassToken.getFirst()) &&
                    request.getMethod().equals(bypassToken.getSecond())) {
                return true;
            }
        }
        return false;
    }
}
