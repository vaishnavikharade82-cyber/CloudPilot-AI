
package com.cloudpilot.backend.controller;

import com.cloudpilot.backend.dto.InfrastructureResourceRequest;
import com.cloudpilot.backend.dto.InfrastructureResourceResponse;
import com.cloudpilot.backend.service.InfrastructureResourceService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/infrastructure-resources")
public class InfrastructureResourceController {

    private final InfrastructureResourceService resourceService;

    public InfrastructureResourceController(
            InfrastructureResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public List<InfrastructureResourceResponse> getAllResources() {
        return resourceService.getAllResources();
    }

    @GetMapping("/{id}")
    public InfrastructureResourceResponse getResourceById(
            @PathVariable UUID id) {
        return resourceService.getResourceById(id);
    }

    @GetMapping("/cloud-account/{cloudAccountId}")
    public List<InfrastructureResourceResponse> getByCloudAccount(
            @PathVariable UUID cloudAccountId) {
        return resourceService.getResourcesByCloudAccount(cloudAccountId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InfrastructureResourceResponse createResource(
            @Valid @RequestBody InfrastructureResourceRequest request) {
        return resourceService.createResource(request);
    }

    @PatchMapping("/{id}/status")
    public InfrastructureResourceResponse updateStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        return resourceService.updateResourceStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteResource(@PathVariable UUID id) {
        resourceService.deleteResource(id);
    }
}
