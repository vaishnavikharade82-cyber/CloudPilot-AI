
package com.cloudpilot.backend.controller;

import com.cloudpilot.backend.dto.IncidentRequest;
import com.cloudpilot.backend.dto.IncidentResponse;
import com.cloudpilot.backend.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<IncidentResponse> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/{id}")
    public IncidentResponse getIncidentById(@PathVariable UUID id) {
        return incidentService.getIncidentById(id);
    }

    @GetMapping("/organization/{organizationId}")
    public List<IncidentResponse> getByOrganization(
            @PathVariable UUID organizationId) {
        return incidentService.getIncidentsByOrganization(organizationId);
    }

    @GetMapping("/status/{status}")
    public List<IncidentResponse> getByStatus(@PathVariable String status) {
        return incidentService.getIncidentsByStatus(status);
    }

    @GetMapping("/severity/{severity}")
    public List<IncidentResponse> getBySeverity(@PathVariable String severity) {
        return incidentService.getIncidentsBySeverity(severity);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentResponse createIncident(
            @Valid @RequestBody IncidentRequest request) {
        return incidentService.createIncident(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIncident(@PathVariable UUID id) {
        incidentService.deleteIncident(id);
    }
}
