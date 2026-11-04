
package com.cloudpilot.backend.service;

import com.cloudpilot.backend.entity.User;
import com.cloudpilot.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new AccessDeniedException("Authentication required");
        }

        Object principal = authentication.getPrincipal();

        String email;

        if (principal instanceof User user) {
            email = user.getEmail();
        } else if (principal instanceof String principalEmail) {
            email = principalEmail;
        } else {
            throw new AccessDeniedException("Invalid authenticated user");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new AccessDeniedException("Authenticated user not found"));
    }

    public UUID getCurrentOrganizationId() {
        return getCurrentUser().getOrganization().getId();
    }
}
