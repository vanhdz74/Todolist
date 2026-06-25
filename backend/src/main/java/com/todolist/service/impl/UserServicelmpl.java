package com.vihotask.service.impl;

import com.vihotask.configurations.MapperConfiguration;
import com.vihotask.dto.UserDTO;
import com.vihotask.entity.Role;
import com.vihotask.entity.User;
import com.vihotask.entity.User_Role;
import com.vihotask.exceptions.AppException;
import com.vihotask.repository.RoleRepository;
import com.vihotask.repository.UserRepository;
import com.vihotask.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.vihotask.enums.ErrorCode.INVALID_REQUEST;
import static com.vihotask.enums.ErrorCode.ROLE_NOT_FOUND;
import static com.vihotask.enums.ErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class UserServicelmpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final MapperConfiguration mapperConfiguration;

    @Override
    public List<UserDTO> FindAll() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(us -> this.mapToUserDto(us))
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(USER_NOT_FOUND));

        // Map với userDTO
        return mapperConfiguration.toUserDTO(user);
    }

    @Override
    public UserDTO insert(UserDTO userDto) {
        if (!userDto.getPassword().equals(userDto.getRetypePassword())) {
            throw new AppException(INVALID_REQUEST);
        }

        User user = User.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .passwordHash(passwordEncoder.encode(userDto.getPassword()))
                .phone(userDto.getPhone())
                .avatarUrl(userDto.getAvatarUrl())
                .status(userDto.isStatus())
                .createdAt(LocalDateTime.now())
                .build();

        // set role
        Role role = roleRepository.findByName(userDto.getRoles().get(0).toUpperCase())
                .orElseThrow(() -> new AppException(ROLE_NOT_FOUND));

        User_Role userRole = new User_Role();
        userRole.setUser(user);
        userRole.setRole(role);

        user.getUserRole().add(userRole);

        userRepository.save(user);

        return mapToUserDto(user);
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(USER_NOT_FOUND));

        user.setUsername(userDTO.getUsername());
        user.setPhone(userDTO.getPhone());
        user.setAvatarUrl(userDTO.getAvatarUrl());
        user.setStatus(userDTO.isStatus());
        user.setEmail(userDTO.getEmail());
        user.setStatus(userDTO.isStatus());
        Role role = roleRepository.findByName(userDTO.getRoles().get(0).toUpperCase())
                .orElseThrow(() -> new AppException(ROLE_NOT_FOUND));

        userRepository.save(user);

        return mapToUserDto(user);
    }


    @Override
    public UserDTO mapToUserDto(User user) {
        List<String> roles = user.getUserRole().stream()
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        return UserDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .roles(roles)
                .build();
    }

    @Override
    public Boolean existsByName(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(USER_NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new AppException(INVALID_REQUEST);
        }

        user.setDeletedAt(LocalDateTime.now());
        user.setStatus(false);

        userRepository.save(user);
    }


}
