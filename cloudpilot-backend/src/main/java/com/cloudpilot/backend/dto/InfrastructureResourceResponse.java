
package com.cloudpilot.backend.dto;

import com.cloudpilot.backend.entity.InfrastructureResource;

import java.time.Instant;
import java.util.UUID;

public class InfrastructureResourceResponse {

    private UUID id;
    private String resourceType;
    private String resourceName;
    private String externalId;
    private String region;
    private String status;
    private UUID cloudAccountId;
    private Instant createdAt;
    private Instant updatedAt;

    public InfrastructureResourceResponse(
            InfrastructureResource resource) {
        this.id = resource.getId();
        this.resourceType = resource.getResourceType();
        this.resourceName = resource.getResourceName();
        this.externalId = resource.getExternalId();
        this.region = resource.getRegion();
        this.status = resource.getStatus();
        this.cloudAccountId = resource.getCloudAccount().getId();
        this.createdAt = resource.getCreatedAt();
        this.updatedAt = resource.getUpdatedAt();
    }

    public UUID getId() {
        return id;
    }

    public String getResourceType() {
        return resourceType;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getExternalId() {
        return externalId;
    }

    public String getRegion() {
        return region;
    }

    public String getStatus() {
        return status;
    }

    public UUID getCloudAccountId() {
        return cloudAccountId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
