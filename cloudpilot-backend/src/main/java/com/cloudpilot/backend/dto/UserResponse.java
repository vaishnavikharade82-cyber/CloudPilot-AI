package com.cloudpilot.backend.dto;

import com.cloudpilot.backend.entity.Role;
import java.util.UUID;

public class UserResponse {

    private UUID id;
    private String name;
    private String email;
    private Role role;
    private UUID organizationId;

    public UserResponse(
            UUID id,
            String name,
            String email,
            Role role,
            UUID organizationId) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.organizationId = organizationId;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }
}