package com.todolist.configurations;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import com.todolist.dto.UserDTO;
import com.todolist.entity.User;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MapperConfiguration {

    private final ModelMapper modelMapper;

    public UserDTO toUserDTO(User user) {
        UserDTO dto = modelMapper.map(user, UserDTO.class);

        // map roles thủ công
        List<String> roles = user.getUserRole().stream()
                .map(ur -> ur.getRole().getName())
                .toList();

        dto.setRoles(roles);

        return dto;
    }
}
