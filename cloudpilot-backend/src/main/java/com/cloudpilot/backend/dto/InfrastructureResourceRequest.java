
package com.cloudpilot.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class InfrastructureResourceRequest {

    @NotBlank(message = "Resource type is required")
    @Pattern(
        regexp = "EC2|S3|RDS|LAMBDA|EKS|OTHER",
        message = "Resource type must be EC2, S3, RDS, LAMBDA, EKS, or OTHER"
    )
    private String resourceType;

    @NotBlank(message = "Resource name is required")
    @Size(max = 150, message = "Resource name cannot exceed 150 characters")
    private String resourceName;

    @NotBlank(message = "External ID is required")
    @Size(max = 200, message = "External ID cannot exceed 200 characters")
    private String externalId;

    @NotBlank(message = "Region is required")
    @Size(max = 100, message = "Region cannot exceed 100 characters")
    private String region;

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "RUNNING|STOPPED|PENDING|TERMINATED|UNKNOWN",
        message = "Status must be RUNNING, STOPPED, PENDING, TERMINATED, or UNKNOWN"
    )
    private String status;

    @NotNull(message = "Cloud account ID is required")
    private UUID cloudAccountId;

    public InfrastructureResourceRequest() {
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UUID getCloudAccountId() {
        return cloudAccountId;
    }

    public void setCloudAccountId(UUID cloudAccountId) {
        this.cloudAccountId = cloudAccountId;
    }
}
