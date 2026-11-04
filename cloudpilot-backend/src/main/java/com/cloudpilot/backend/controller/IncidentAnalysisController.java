
package com.cloudpilot.backend.controller;

import com.cloudpilot.backend.dto.IncidentAnalysisResponse;
import com.cloudpilot.backend.service.IncidentAnalysisService;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
public class IncidentAnalysisController {

    private final IncidentAnalysisService incidentAnalysisService;

    public IncidentAnalysisController(
            IncidentAnalysisService incidentAnalysisService) {
        this.incidentAnalysisService = incidentAnalysisService;
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<IncidentAnalysisResponse> analyzeIncident(
            @PathVariable @NotNull UUID id) {

        IncidentAnalysisResponse response =
                incidentAnalysisService.analyzeIncident(id);

        return ResponseEntity.ok(response);
    }
}
