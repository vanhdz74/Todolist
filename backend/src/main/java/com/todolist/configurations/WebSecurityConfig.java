package com.todolist.configurations;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.todolist.entity.Role;
import com.todolist.filter.JwtTokenFilter;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@EnableWebMvc
@RequiredArgsConstructor
public class WebSecurityConfig {

    @Value("${api.prefix}")
    private String apiPrefix;

    private final JwtTokenFilter jwtTokenFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                //  Kích hoạt CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                //  Tắt CSRF (vì bạn dùng JWT)
                //  .csrf(AbstractHttpConfigurer::disable)
                .csrf(customizer -> customizer.disable())

                //  Thêm JWT filter
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)

                //  Luật phân quyền
                .authorizeHttpRequests(requests -> requests
                                .requestMatchers(
                                        String.format("%s/register", apiPrefix),
                                        String.format("%s/login", apiPrefix),
                                        String.format("%s/refresh", apiPrefix)

                                ).permitAll()

                                // user
                                .requestMatchers(GET, "/users").hasRole(Role.ADMIN)
                                .requestMatchers(GET, "/users/{id}").authenticated()
                                .requestMatchers(POST, "/users").hasRole(Role.ADMIN)
                                .requestMatchers(DELETE, "/users/{id}").authenticated()
                                .requestMatchers(PUT, "/users").hasRole(Role.ADMIN)


                                .anyRequest().authenticated()
                );

        return http.build();
    }
}
