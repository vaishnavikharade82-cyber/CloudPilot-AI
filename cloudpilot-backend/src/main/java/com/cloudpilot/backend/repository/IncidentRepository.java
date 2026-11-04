package com.cloudpilot.backend.repository;

import com.cloudpilot.backend.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IncidentRepository extends JpaRepository<Incident, UUID> {

    List<Incident> findByOrganizationId(UUID organizationId);

    List<Incident> findByStatus(String status);

    List<Incident> findBySeverity(String severity);
}