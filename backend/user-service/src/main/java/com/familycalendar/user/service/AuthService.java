package com.familycalendar.user.service;

import com.familycalendar.user.dto.AuthResponse;
import com.familycalendar.user.dto.LoginRequest;
import com.familycalendar.user.dto.RegisterRequest;
import com.familycalendar.user.model.Family;
import com.familycalendar.user.model.User;
import com.familycalendar.user.repository.FamilyRepository;
import com.familycalendar.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final List<String> AVATAR_COLORS = List.of(
            "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
            "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
    );

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAvatarColor(AVATAR_COLORS.get((int) (Math.random() * AVATAR_COLORS.size())));

        Family family;
        if (request.getInviteCode() != null && !request.getInviteCode().isBlank()) {
            family = familyRepository.findByInviteCode(request.getInviteCode())
                    .orElseThrow(() -> new RuntimeException("Invalid invite code"));
        } else {
            family = new Family();
            family.setName(request.getFamilyName() != null ? request.getFamilyName() : request.getName() + "'s Family");
            family = familyRepository.save(family);
        }

        user.setFamily(family);
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail(), family.getId(), user.getName());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(),
                family.getId(), family.getName(), user.getAvatarColor());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String familyId = user.getFamily() != null ? user.getFamily().getId() : null;
        String familyName = user.getFamily() != null ? user.getFamily().getName() : null;
        String token = jwtService.generateToken(user.getId(), user.getEmail(), familyId, user.getName());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(),
                familyId, familyName, user.getAvatarColor());
    }
}
