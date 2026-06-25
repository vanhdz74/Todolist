package com.vihotask.service;

import com.vihotask.dto.UserDTO;
import com.vihotask.entity.User;
import com.vihotask.exceptions.InvalidParamException;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    User login(String email, String password);

    String refreshToken(String refreshToken) throws InvalidParamException;

    User register(UserDTO userDTO);
}
