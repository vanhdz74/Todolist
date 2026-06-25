package com.vihotask.service.impl;

import com.vihotask.components.JwtTokenUtil;
import com.vihotask.dto.UserDTO;
import com.vihotask.entity.Role;
import com.vihotask.entity.User;
import com.vihotask.entity.User_Role;
import com.vihotask.enums.ErrorCode;
import com.vihotask.exceptions.AppException;
import com.vihotask.exceptions.InvalidParamException;
import com.vihotask.repository.AuthRepository;
import com.vihotask.repository.RoleRepository;
import com.vihotask.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public User login(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();

        // Để Spring Security tự load user và kiểm tra password bằng PasswordEncoder.
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                normalizedEmail, password
        );
        authenticationManager.authenticate(authToken);

        // Lấy lại user kèm roles để controller có thể sinh JWT mà không bị lazy-load lỗi.
        return authRepository.findByEmailWithRoles(normalizedEmail)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
    }

    @Override
    public String refreshToken(String refreshToken) throws InvalidParamException {
        String email = jwtTokenUtil.extractEmail(refreshToken);

        User user = authRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return jwtTokenUtil.generateAccessToken(user);
    }


    @Override
    public User register(UserDTO userDTO) {
        //register user
        String email = userDTO.getEmail().trim().toLowerCase();

        // Kiểm tra xem email đã tồn tại hay chưa
        if (authRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Chọn vai trò
        Role role = roleRepository.findByName(userDTO.getRoles().get(0).toUpperCase())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

//        if (role.getName().toUpperCase().equals(Role.ADMIN)) {
//            throw new PermissionDenyException("You cannot register an admin account");
//        }

        // Convert from userDTO => userEntity sử dụng builder pattern
        User newUser = User.builder()
                .username(userDTO.getUsername())
                .email(email)
                .passwordHash(userDTO.getPassword())
                .phone(userDTO.getPhone())
                .avatarUrl(userDTO.getAvatarUrl())
                .status(true)
//                .facebookAccountId(userDTO.getFacebookAccountId())
//                .googleAccountId(userDTO.getGoogleAccountId())
                .build();

        // Kiểm tra nếu có accountId, không yêu cầu password
//        if (userDTO.getFacebookAccountId() == 0 && userDTO.getGoogleAccountId() == 0) {
//        }

        // encode password
        String encodedPassword = passwordEncoder.encode(newUser.getPasswordHash());
        newUser.setPasswordHash(encodedPassword);

        // TẠO MAPPING MỚI
        if (newUser.getUserRole() == null) {
            newUser.setUserRole(new ArrayList<>());
        }

        User_Role userRole = new User_Role();
        userRole.setUser(newUser);
        userRole.setRole(role);

        // add vào list của user
        newUser.getUserRole().add(userRole);
        return authRepository.save(newUser);
    }
}
