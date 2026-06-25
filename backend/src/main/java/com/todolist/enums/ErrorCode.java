package com.vihotask.enums;

public enum ErrorCode {

    USER_NOT_FOUND(4041, "User không tồn tại"),
    ROLE_NOT_FOUND(4042, "Role không tồn tại"),

    INVALID_REQUEST(4001, "Dữ liệu không hợp lệ"),
    EMAIL_ALREADY_EXISTS(4002, "Email đã tồn tại"),
    PASSWORD_NOT_MATCH(4003, "Mật khẩu nhập lại không khớp"),

    UNAUTHORIZED(4010, "Email hoặc mật khẩu không đúng"),

    INTERNAL_ERROR(5000, "Lỗi hệ thống");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() { return code; }
    public String getMessage() { return message; }
}
