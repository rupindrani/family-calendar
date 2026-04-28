package com.familycalendar.user.service;

import com.familycalendar.user.dto.UserDto;
import com.familycalendar.user.model.Family;
import com.familycalendar.user.model.User;
import com.familycalendar.user.repository.FamilyRepository;
import com.familycalendar.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;

    public List<UserDto> getFamilyMembers(String familyId) {
        return userRepository.findByFamilyId(familyId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDto(user);
    }

    public Family getFamilyInfo(String familyId) {
        return familyRepository.findById(familyId)
                .orElseThrow(() -> new RuntimeException("Family not found"));
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAvatarColor(user.getAvatarColor());
        dto.setFamilyId(user.getFamily() != null ? user.getFamily().getId() : null);
        return dto;
    }
}
