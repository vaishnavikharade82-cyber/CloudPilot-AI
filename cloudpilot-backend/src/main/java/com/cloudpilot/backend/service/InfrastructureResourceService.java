
package com.cloudpilot.backend.service;

import com.cloudpilot.backend.dto.InfrastructureResourceRequest;
import com.cloudpilot.backend.dto.InfrastructureResourceResponse;
import com.cloudpilot.backend.entity.CloudAccount;
import com.cloudpilot.backend.entity.InfrastructureResource;
import com.cloudpilot.backend.repository.CloudAccountRepository;
import com.cloudpilot.backend.repository.InfrastructureResourceRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class InfrastructureResourceService {

    private final InfrastructureResourceRepository resourceRepository;
    private final CloudAccountRepository cloudAccountRepository;
    private final CurrentUserService currentUserService;

    public InfrastructureResourceService(
            InfrastructureResourceRepository resourceRepository,
            CloudAccountRepository cloudAccountRepository,
            CurrentUserService currentUserService) {
        this.resourceRepository = resourceRepository;
        this.cloudAccountRepository = cloudAccountRepository;
        this.currentUserService = currentUserService;
    }

    public List<InfrastructureResourceResponse> getAllResources() {
        UUID organizationId =
                currentUserService.getCurrentOrganizationId();

        return resourceRepository.findAll()
                .stream()
                .filter(resource -> resource.getCloudAccount()
                        .getOrganization().getId().equals(organizationId))
                .map(InfrastructureResourceResponse::new)
                .toList();
    }

    public InfrastructureResourceResponse getResourceById(UUID id) {
        return new InfrastructureResourceResponse(findAuthorizedResource(id));
    }

    public List<InfrastructureResourceResponse> getResourcesByCloudAccount(
            UUID cloudAccountId) {

        ensureCloudAccountAccess(cloudAccountId);

        return resourceRepository.findByCloudAccountId(cloudAccountId)
                .stream()
                .map(InfrastructureResourceResponse::new)
                .toList();
    }

    @Transactional
    public InfrastructureResourceResponse createResource(
            InfrastructureResourceRequest request) {

        CloudAccount cloudAccount = ensureCloudAccountAccess(
                request.getCloudAccountId());

        InfrastructureResource resource = new InfrastructureResource();
        resource.setResourceType(request.getResourceType());
        resource.setResourceName(request.getResourceName());
        resource.setExternalId(request.getExternalId());
        resource.setRegion(request.getRegion());
        resource.setStatus(request.getStatus());
        resource.setCloudAccount(cloudAccount);

        return new InfrastructureResourceResponse(
                resourceRepository.save(resource));
    }

    @Transactional
    public InfrastructureResourceResponse updateResourceStatus(
            UUID id, String status) {

        if (status == null || !List.of(
                "RUNNING", "STOPPED", "PENDING", "TERMINATED", "UNKNOWN"
        ).contains(status)) {
            throw new RuntimeException(
                    "Status must be RUNNING, STOPPED, PENDING, TERMINATED, or UNKNOWN");
        }

        InfrastructureResource resource = findAuthorizedResource(id);
        resource.setStatus(status);

        return new InfrastructureResourceResponse(
                resourceRepository.save(resource));
    }

    @Transactional
    public void deleteResource(UUID id) {
        resourceRepository.delete(findAuthorizedResource(id));
    }

    private InfrastructureResource findAuthorizedResource(UUID id) {
        InfrastructureResource resource = resourceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Infrastructure resource not found"));

        ensureCloudAccountAccess(resource.getCloudAccount().getId());

        return resource;
    }

    private CloudAccount ensureCloudAccountAccess(UUID cloudAccountId) {
        CloudAccount account = cloudAccountRepository.findById(cloudAccountId)
                .orElseThrow(() ->
                        new RuntimeException("Cloud account not found"));

        UUID currentOrganizationId =
                currentUserService.getCurrentOrganizationId();

        if (!account.getOrganization().getId()
                .equals(currentOrganizationId)) {
            throw new AccessDeniedException(
                    "You cannot access another organization's resources");
        }

        return account;
    }
}
