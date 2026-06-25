package com.vihotask.utils;

import com.vihotask.dto.ApiResponse;
import com.vihotask.enums.ErrorCode;
import com.vihotask.exceptions.DataNotFoundException;
import com.vihotask.exceptions.InvalidParamException;
import com.vihotask.exceptions.AppException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        return ResponseUtil.error(errorCode.getMessage(), getHttpStatus(errorCode), errorCode.getCode());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + Objects.requireNonNullElse(error.getDefaultMessage(), "Không hợp lệ"))
                .findFirst()
                .orElse(ErrorCode.INVALID_REQUEST.getMessage());

        return ResponseUtil.error(message, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_REQUEST.getCode());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(BadCredentialsException ex) {
        return ResponseUtil.error(
                ErrorCode.UNAUTHORIZED.getMessage(),
                HttpStatus.UNAUTHORIZED,
                ErrorCode.UNAUTHORIZED.getCode()
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        return ResponseUtil.error(
                ErrorCode.INVALID_REQUEST.getMessage(),
                HttpStatus.BAD_REQUEST,
                ErrorCode.INVALID_REQUEST.getCode()
        );
    }

    @ExceptionHandler({DataNotFoundException.class, InvalidParamException.class})
    public ResponseEntity<ApiResponse<Void>> handleKnownException(Exception ex) {
        return ResponseUtil.error(ex.getMessage(), HttpStatus.BAD_REQUEST, ErrorCode.INVALID_REQUEST.getCode());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        return ResponseUtil.error(
                ErrorCode.INTERNAL_ERROR.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_ERROR.getCode()
        );
    }

    private HttpStatus getHttpStatus(ErrorCode errorCode) {
        return switch (errorCode) {
            case UNAUTHORIZED -> HttpStatus.UNAUTHORIZED;
            case USER_NOT_FOUND, ROLE_NOT_FOUND -> HttpStatus.NOT_FOUND;
            case INTERNAL_ERROR -> HttpStatus.INTERNAL_SERVER_ERROR;
            default -> HttpStatus.BAD_REQUEST;
        };
    }

}
