package com.cloudpilot.backend.dto;

import com.cloudpilot.backend.entity.Incident;

import java.time.LocalDateTime;
import java.util.UUID;

public class IncidentResponse {

    private UUID id;
    private String title;
    private String description;
    private String severity;
    private String status;
    private LocalDateTime detectedAt;
    private LocalDateTime resolvedAt;
    private UUID organizationId;

    public IncidentResponse(Incident incident) {
        this.id = incident.getId();
        this.title = incident.getTitle();
        this.description = incident.getDescription();
        this.severity = incident.getSeverity();
        this.status = incident.getStatus();
        this.detectedAt = incident.getDetectedAt();
        this.resolvedAt = incident.getResolvedAt();

        if (incident.getOrganization() != null) {
            this.organizationId = incident.getOrganization().getId();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getSeverity() {
        return severity;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }
}