
package com.cloudpilot.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record IncidentAnalysisResponse(
        UUID incidentId,
        String incidentTitle,
        String severity,
        String summary,
        List<String> possibleRootCauses,
        List<String> recommendedActions,
        String confidence,
        LocalDateTime analyzedAt
) {
}
