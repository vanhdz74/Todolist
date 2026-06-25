package com.vihotask.service;

import com.vihotask.dto.UserDTO;
import com.vihotask.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    public List<UserDTO> FindAll();
    public UserDTO getUser(Long id);
    public UserDTO insert(UserDTO userDto);
    public UserDTO updateUser(Long id, UserDTO userDTO);
    public UserDTO mapToUserDto(User user);
    public Boolean existsByName(String username);
    public void deleteUser(Long id);

}
