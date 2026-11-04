
package com.cloudpilot.backend.service;

import com.cloudpilot.backend.dto.IncidentRequest;
import com.cloudpilot.backend.dto.IncidentResponse;
import com.cloudpilot.backend.entity.Incident;
import com.cloudpilot.backend.entity.Organization;
import com.cloudpilot.backend.repository.IncidentRepository;
import com.cloudpilot.backend.repository.OrganizationRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final OrganizationRepository organizationRepository;
    private final CurrentUserService currentUserService;

    public IncidentService(
            IncidentRepository incidentRepository,
            OrganizationRepository organizationRepository,
            CurrentUserService currentUserService) {
        this.incidentRepository = incidentRepository;
        this.organizationRepository = organizationRepository;
        this.currentUserService = currentUserService;
    }

    public List<IncidentResponse> getAllIncidents() {
        UUID organizationId =
                currentUserService.getCurrentOrganizationId();

        return incidentRepository.findByOrganizationId(organizationId)
                .stream()
                .map(IncidentResponse::new)
                .toList();
    }

    public IncidentResponse getIncidentById(UUID id) {
        return new IncidentResponse(findAuthorizedIncident(id));
    }

    public List<IncidentResponse> getIncidentsByOrganization(
            UUID organizationId) {

        ensureOrganizationAccess(organizationId);

        return incidentRepository.findByOrganizationId(organizationId)
                .stream()
                .map(IncidentResponse::new)
                .toList();
    }

    public List<IncidentResponse> getIncidentsByStatus(String status) {
        UUID organizationId =
                currentUserService.getCurrentOrganizationId();

        return incidentRepository.findByOrganizationId(organizationId)
                .stream()
                .filter(incident -> incident.getStatus().equals(status))
                .map(IncidentResponse::new)
                .toList();
    }

    public List<IncidentResponse> getIncidentsBySeverity(String severity) {
        UUID organizationId =
                currentUserService.getCurrentOrganizationId();

        return incidentRepository.findByOrganizationId(organizationId)
                .stream()
                .filter(incident -> incident.getSeverity().equals(severity))
                .map(IncidentResponse::new)
                .toList();
    }

    @Transactional
    public IncidentResponse createIncident(IncidentRequest request) {
    UUID organizationId = currentUserService.getCurrentOrganizationId();

    Organization organization = organizationRepository
            .findById(organizationId)
            .orElseThrow(() ->
                    new RuntimeException("Organization not found"));

    Incident incident = new Incident();
    incident.setTitle(request.getTitle());
    incident.setDescription(request.getDescription());
    incident.setSeverity(request.getSeverity());
    incident.setStatus(request.getStatus());
    incident.setOrganization(organization);
    incident.setDetectedAt(LocalDateTime.now());

    return new IncidentResponse(incidentRepository.save(incident));
}

    @Transactional
    public void deleteIncident(UUID id) {
        Incident incident = findAuthorizedIncident(id);
        incidentRepository.delete(incident);
    }

    private Incident findAuthorizedIncident(UUID id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Incident not found"));

        ensureOrganizationAccess(incident.getOrganization().getId());

        return incident;
    }
        private void ensureOrganizationAccess(UUID organizationId) {
        if (!currentUserService.getCurrentOrganizationId()
                .equals(organizationId)) {
            throw new AccessDeniedException(
                    "You cannot access another organization's incidents");
        }
    }
    
}
