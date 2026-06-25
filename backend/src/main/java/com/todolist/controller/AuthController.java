package com.todolist.controller;

import com.todolist.components.JwtTokenUtil;
import com.todolist.dto.ApiResponse;
import com.todolist.dto.UserDTO;
import com.todolist.dto.UserLoginDTO;
import com.todolist.entity.User;
import com.todolist.enums.ErrorCode;
import com.todolist.exceptions.AppException;
import com.todolist.exceptions.InvalidParamException;
import com.todolist.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtTokenUtil jwtTokenUtil;

    // Xử lý đăng nhập
    @PostMapping("/login")
    public ApiResponse<Map<String, String>> loginUser(@Valid @RequestBody UserLoginDTO userLoginDTO) throws InvalidParamException {
        User user = authService.login(userLoginDTO.getEmail(), userLoginDTO.getPassword());

        String accessToken = jwtTokenUtil.generateAccessToken(user);
        String refreshToken = jwtTokenUtil.generateRefreshToken(user);

        return ApiResponse.success(Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken
        ), "Login successfully");
    }

    // Xử lý refresh token
    @PostMapping("/refresh")
    public ApiResponse<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) throws InvalidParamException {
        String refreshToken = request.get("refreshToken");
        String newAccessToken = authService.refreshToken(refreshToken);
        return ApiResponse.success(Map.of("accessToken", newAccessToken), "Refresh token successfully");
    }


    // Xử lý tạo tài khoản
    @PostMapping("/register")
    // Kiểm tra xem có đầy đủ các filed yêu cầu hay ko
    public ApiResponse<Void> createUser(@Valid @RequestBody UserDTO userDTO) {
        if (!userDTO.getPassword().equals(userDTO.getRetypePassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        authService.register(userDTO);

        return ApiResponse.success("Register successfully");
    }
}
