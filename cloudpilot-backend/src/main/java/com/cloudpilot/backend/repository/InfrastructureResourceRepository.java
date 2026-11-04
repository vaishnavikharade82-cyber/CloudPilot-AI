package com.cloudpilot.backend.repository;

import com.cloudpilot.backend.entity.InfrastructureResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InfrastructureResourceRepository
        extends JpaRepository<InfrastructureResource, UUID> {

    List<InfrastructureResource> findByCloudAccountId(UUID cloudAccountId);
}