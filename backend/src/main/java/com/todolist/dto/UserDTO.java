package com.todolist.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Data //toString
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String username;

    private String email;

    private String password;

    @JsonProperty("retype_password")
    private String retypePassword;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("avatar_url")
    private String avatarUrl;

//    private int googleAccountId;

    @JsonProperty("status")
    private boolean status;

    private List<String> roles;
}
