
package com.cloudpilot.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CloudAccountRequest {

    @NotBlank(message = "Cloud provider is required")
    @Pattern(
        regexp = "AWS|AZURE|GCP",
        message = "Provider must be AWS, AZURE, or GCP"
    )
    private String provider;

    @NotBlank(message = "Account identifier is required")
    @Size(max = 100, message = "Account identifier cannot exceed 100 characters")
    private String accountIdentifier;

    @NotBlank(message = "Display name is required")
    @Size(max = 150, message = "Display name cannot exceed 150 characters")
    private String displayName;

    @NotNull(message = "Organization ID is required")
    private UUID organizationId;

    public CloudAccountRequest() {
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getAccountIdentifier() {
        return accountIdentifier;
    }

    public void setAccountIdentifier(String accountIdentifier) {
        this.accountIdentifier = accountIdentifier;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(UUID organizationId) {
        this.organizationId = organizationId;
    }
}
