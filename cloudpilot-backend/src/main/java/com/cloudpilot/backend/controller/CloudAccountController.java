
package com.cloudpilot.backend.controller;

import com.cloudpilot.backend.dto.CloudAccountRequest;
import com.cloudpilot.backend.dto.CloudAccountResponse;
import com.cloudpilot.backend.service.CloudAccountService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cloud-accounts")
public class CloudAccountController {

    private final CloudAccountService cloudAccountService;

    public CloudAccountController(
            CloudAccountService cloudAccountService) {
        this.cloudAccountService = cloudAccountService;
    }

    @GetMapping
    public List<CloudAccountResponse> getAllAccounts() {
        return cloudAccountService.getAllAccounts();
    }

    @GetMapping("/{id}")
    public CloudAccountResponse getAccountById(
            @PathVariable UUID id) {
        return cloudAccountService.getAccountById(id);
    }

    @GetMapping("/organization/{organizationId}")
    public List<CloudAccountResponse> getAccountsByOrganization(
            @PathVariable UUID organizationId) {
        return cloudAccountService
                .getAccountsByOrganization(organizationId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CloudAccountResponse createAccount(
            @Valid @RequestBody CloudAccountRequest request) {
        return cloudAccountService.createAccount(request);
    }

    @PatchMapping("/{id}/status")
    public CloudAccountResponse updateAccountStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        return cloudAccountService.updateAccountStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(@PathVariable UUID id) {
        cloudAccountService.deleteAccount(id);
    }
}
