
package com.cloudpilot.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class IncidentRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    @NotBlank(message = "Severity is required")
    @Pattern(
        regexp = "LOW|MEDIUM|HIGH|CRITICAL",
        message = "Severity must be LOW, MEDIUM, HIGH, or CRITICAL"
    )
    private String severity;

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "OPEN|IN_PROGRESS|RESOLVED",
        message = "Status must be OPEN, IN_PROGRESS, or RESOLVED"
    )
    private String status;


    public IncidentRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

   
}
