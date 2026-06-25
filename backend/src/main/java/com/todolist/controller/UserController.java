package com.todolist.controller;

import com.todolist.dto.ApiResponse;
import com.todolist.dto.UserDTO;
import com.todolist.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // Get user
    @GetMapping("/user/{id}")
    public ApiResponse<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUser(id);
        return ApiResponse.success(user, "Lấy user thành công");
    }

    // Get list user
    @GetMapping("/users")
    public ApiResponse<List<UserDTO>> viewAll(){
        List<UserDTO> users = userService.FindAll();
        return ApiResponse.success(users, "Lấy danh sách user thành công");
    }
}

