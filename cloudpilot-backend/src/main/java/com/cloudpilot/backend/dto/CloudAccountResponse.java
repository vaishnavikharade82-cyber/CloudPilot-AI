
package com.cloudpilot.backend.dto;

import com.cloudpilot.backend.entity.CloudAccount;

import java.time.Instant;
import java.util.UUID;

public class CloudAccountResponse {

    private UUID id;
    private String provider;
    private String accountIdentifier;
    private String displayName;
    private String status;
    private UUID organizationId;
    private Instant createdAt;
    private Instant updatedAt;

    public CloudAccountResponse(CloudAccount account) {
        this.id = account.getId();
        this.provider = account.getProvider();
        this.accountIdentifier = account.getAccountIdentifier();
        this.displayName = account.getDisplayName();
        this.status = account.getStatus();
        this.organizationId = account.getOrganization().getId();
        this.createdAt = account.getCreatedAt();
        this.updatedAt = account.getUpdatedAt();
    }

    public UUID getId() {
        return id;
    }

    public String getProvider() {
        return provider;
    }

    public String getAccountIdentifier() {
        return accountIdentifier;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getStatus() {
        return status;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
