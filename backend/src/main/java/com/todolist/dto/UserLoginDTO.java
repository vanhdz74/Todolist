package com.todolist.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data // toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {
    // Đăng nhập email, mật khẩu

    // @JsonProperty("email") // nếu tên dưới db khác thì dùng
    @NotBlank(message = "Email là yêu cầu bắt buộc")
    private String email;

    @NotBlank(message = "Mật khẩu ko được để trống")
    private String password;
}
