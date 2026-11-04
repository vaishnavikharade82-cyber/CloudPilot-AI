package com.cloudpilot.backend.repository;

import com.cloudpilot.backend.entity.CloudAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CloudAccountRepository extends JpaRepository<CloudAccount, UUID> {

    List<CloudAccount> findByOrganizationId(UUID organizationId);
}