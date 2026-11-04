package com.cloudpilot.backend.dto;

import java.util.UUID;

public class LoginResponse {

    private String token;
    private String tokenType;
    private UUID userId;
    private String name;
    private String email;
    private String role;
    private UUID organizationId;

    public LoginResponse(
            String token,
            UUID userId,
            String name,
            String email,
            String role,
            UUID organizationId) {

        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.organizationId = organizationId;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }
}