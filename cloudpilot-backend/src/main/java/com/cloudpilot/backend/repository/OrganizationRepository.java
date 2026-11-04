package com.cloudpilot.backend.repository;

import com.cloudpilot.backend.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {

    boolean existsByName(String name);
}