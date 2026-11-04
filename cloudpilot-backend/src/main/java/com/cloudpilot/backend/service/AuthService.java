package com.cloudpilot.backend.service;

import com.cloudpilot.backend.dto.LoginRequest;
import com.cloudpilot.backend.dto.LoginResponse;
import com.cloudpilot.backend.dto.RegisterRequest;
import com.cloudpilot.backend.entity.Organization;
import com.cloudpilot.backend.entity.Role;
import com.cloudpilot.backend.entity.User;
import com.cloudpilot.backend.repository.OrganizationRepository;
import com.cloudpilot.backend.repository.UserRepository;
import com.cloudpilot.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            OrganizationRepository organizationRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        if (organizationRepository.existsByName(request.getOrganizationName())) {
            throw new RuntimeException("Organization already exists");
        }

        Organization organization = new Organization();
        organization.setName(request.getOrganizationName());

        Organization savedOrganization =
                organizationRepository.save(organization);

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(Role.USER);
        user.setOrganization(savedOrganization);

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getOrganization().getId()
        );
    }
}