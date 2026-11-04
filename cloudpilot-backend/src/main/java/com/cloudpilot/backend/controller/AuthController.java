package com.cloudpilot.backend.controller;

import com.cloudpilot.backend.dto.LoginRequest;
import com.cloudpilot.backend.dto.LoginResponse;
import com.cloudpilot.backend.dto.RegisterRequest;
import com.cloudpilot.backend.dto.UserResponse;
import com.cloudpilot.backend.entity.User;
import com.cloudpilot.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
            @Valid @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getOrganization().getId()
        );
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}