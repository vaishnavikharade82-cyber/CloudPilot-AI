
package com.cloudpilot.backend.service;

import com.cloudpilot.backend.dto.IncidentAnalysisResponse;
import com.cloudpilot.backend.entity.Incident;
import com.cloudpilot.backend.repository.IncidentRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class IncidentAnalysisService {

    private final IncidentRepository incidentRepository;
    private final CurrentUserService currentUserService;

    public IncidentAnalysisService(
            IncidentRepository incidentRepository,
            CurrentUserService currentUserService) {
        this.incidentRepository = incidentRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public IncidentAnalysisResponse analyzeIncident(UUID incidentId) {

        UUID organizationId =
                currentUserService.getCurrentOrganizationId();

        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Incident not found"));

        if (!incident.getOrganization().getId().equals(organizationId)) {
            throw new AccessDeniedException(
                    "You cannot analyze another organization's incident");
        }

        String title = incident.getTitle() == null
                ? "" : incident.getTitle();

        String description = incident.getDescription() == null
                ? "" : incident.getDescription();

        String text = (title + " " + description)
                .toLowerCase(Locale.ROOT);

        List<String> causes = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        if (containsAny(text, "cpu", "processor", "high load")) {
            causes.add("High CPU utilization caused by heavy workloads, "
                    + "inefficient processes, or traffic spikes.");
            actions.add("Inspect CPU utilization and identify processes "
                    + "consuming the most resources.");
            actions.add("Check recent deployments and traffic changes.");
            actions.add("Consider scaling resources if high utilization persists.");

        } else if (containsAny(text, "database", "sql", "query",
                "latency", "slow response")) {
            causes.add("Possible slow database queries, connection "
                    + "pool saturation, locks, or resource contention.");
            actions.add("Inspect slow-query logs and database performance metrics.");
            actions.add("Check connection pool usage, locks, and database load.");
            actions.add("Review recent database or application changes.");

        } else if (containsAny(text, "memory", "out of memory", "oom")) {
            causes.add("Possible memory exhaustion, a memory leak, "
                    + "or insufficient allocated memory.");
            actions.add("Inspect memory utilization and application logs.");
            actions.add("Check for memory leaks and unusual workload growth.");
            actions.add("Review memory limits before considering scaling.");

        } else if (containsAny(text, "network", "timeout",
                "connection refused", "connectivity")) {
            causes.add("Possible network connectivity problems, "
                    + "timeouts, DNS issues, or overloaded services.");
            actions.add("Check connectivity, DNS resolution, and service endpoints.");
            actions.add("Inspect network metrics, timeouts, and service logs.");
            actions.add("Verify dependencies are healthy and reachable.");

        } else if (containsAny(text, "disk", "storage", "filesystem")) {
            causes.add("Possible disk capacity exhaustion, storage "
                    + "I/O bottlenecks, or filesystem problems.");
            actions.add("Check disk usage and storage I/O metrics.");
            actions.add("Review application logs for disk-full or I/O errors.");
            actions.add("Safely free unnecessary storage or expand capacity if needed.");

        } else if (containsAny(text, "down", "unavailable",
                "crash", "failed", "failure", "offline")) {
            causes.add("Possible service crash, failed deployment, "
                    + "configuration issue, or unavailable dependency.");
            actions.add("Inspect application logs and health-check results.");
            actions.add("Verify dependencies and recent deployment changes.");
            actions.add("Follow the service recovery procedure if an outage is confirmed.");

        } else {
            causes.add("The incident details do not match a specific "
                    + "known rule. More logs and monitoring metrics are needed.");
            actions.add("Review application logs around the detection time.");
            actions.add("Inspect CPU, memory, network, and dependency metrics.");
            actions.add("Add relevant error messages and monitoring data "
                    + "to improve the analysis.");
        }

        if ("CRITICAL".equalsIgnoreCase(incident.getSeverity())
                || "HIGH".equalsIgnoreCase(incident.getSeverity())) {
            actions.add("Prioritize investigation and assess customer impact.");
        }

        String summary = "Rule-based analysis for a "
                + incident.getSeverity()
                + " severity incident. "
                + "These are possible causes, not confirmed root causes.";

        return new IncidentAnalysisResponse(
                incident.getId(),
                incident.getTitle(),
                incident.getSeverity(),
                summary,
                causes,
                actions,
                "Heuristic assessment; root cause not verified",
                LocalDateTime.now()
        );
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}
