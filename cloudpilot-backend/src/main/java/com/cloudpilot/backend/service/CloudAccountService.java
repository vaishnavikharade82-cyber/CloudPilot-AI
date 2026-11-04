
package com.cloudpilot.backend.service;

import com.cloudpilot.backend.dto.CloudAccountRequest;
import com.cloudpilot.backend.dto.CloudAccountResponse;
import com.cloudpilot.backend.entity.CloudAccount;
import com.cloudpilot.backend.entity.Organization;
import com.cloudpilot.backend.repository.CloudAccountRepository;
import com.cloudpilot.backend.repository.OrganizationRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CloudAccountService {

    private final CloudAccountRepository cloudAccountRepository;
    private final OrganizationRepository organizationRepository;
    private final CurrentUserService currentUserService;

    public CloudAccountService(
            CloudAccountRepository cloudAccountRepository,
            OrganizationRepository organizationRepository,
            CurrentUserService currentUserService) {
        this.cloudAccountRepository = cloudAccountRepository;
        this.organizationRepository = organizationRepository;
        this.currentUserService = currentUserService;
    }

    public List<CloudAccountResponse> getAllAccounts() {
        UUID organizationId =
                currentUserService.getCurrentOrganizationId();

        return cloudAccountRepository
                .findByOrganizationId(organizationId)
                .stream()
                .map(CloudAccountResponse::new)
                .toList();
    }

    public CloudAccountResponse getAccountById(UUID id) {
        return new CloudAccountResponse(findAuthorizedAccount(id));
    }

    public List<CloudAccountResponse> getAccountsByOrganization(
            UUID organizationId) {

        ensureCurrentOrganization(organizationId);

        return cloudAccountRepository
                .findByOrganizationId(organizationId)
                .stream()
                .map(CloudAccountResponse::new)
                .toList();
    }

    @Transactional
    public CloudAccountResponse createAccount(
            CloudAccountRequest request) {

        ensureCurrentOrganization(request.getOrganizationId());

        Organization organization = organizationRepository
                .findById(request.getOrganizationId())
                .orElseThrow(() ->
                        new RuntimeException("Organization not found"));

        CloudAccount account = new CloudAccount();
        account.setProvider(request.getProvider());
        account.setAccountIdentifier(request.getAccountIdentifier());
        account.setDisplayName(request.getDisplayName());
        account.setStatus("ACTIVE");
        account.setOrganization(organization);

        return new CloudAccountResponse(
                cloudAccountRepository.save(account));
    }

    @Transactional
    public CloudAccountResponse updateAccountStatus(
            UUID id, String status) {

        if (status == null || !List.of(
                "ACTIVE", "INACTIVE", "DISCONNECTED"
        ).contains(status)) {
            throw new RuntimeException(
                    "Status must be ACTIVE, INACTIVE, or DISCONNECTED");
        }

        CloudAccount account = findAuthorizedAccount(id);
        account.setStatus(status);

        return new CloudAccountResponse(
                cloudAccountRepository.save(account));
    }

    @Transactional
    public void deleteAccount(UUID id) {
        cloudAccountRepository.delete(findAuthorizedAccount(id));
    }

    private CloudAccount findAuthorizedAccount(UUID id) {
        CloudAccount account = cloudAccountRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Cloud account not found"));

        ensureCurrentOrganization(account.getOrganization().getId());

        return account;
    }

    private void ensureCurrentOrganization(UUID organizationId) {
        if (!currentUserService.getCurrentOrganizationId()
                .equals(organizationId)) {
            throw new AccessDeniedException(
                    "You cannot access another organization's cloud accounts");
        }
    }
}
