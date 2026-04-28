package com.familycalendar.user.controller;

import com.familycalendar.user.dto.UserDto;
import com.familycalendar.user.model.Family;
import com.familycalendar.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/api/families/{familyId}/members")
    public ResponseEntity<List<UserDto>> getFamilyMembers(@PathVariable String familyId) {
        return ResponseEntity.ok(userService.getFamilyMembers(familyId));
    }

    @GetMapping("/api/families/{familyId}")
    public ResponseEntity<Map<String, String>> getFamilyInfo(@PathVariable String familyId) {
        Family family = userService.getFamilyInfo(familyId);
        return ResponseEntity.ok(Map.of(
                "id", family.getId(),
                "name", family.getName(),
                "inviteCode", family.getInviteCode()
        ));
    }

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<UserDto> getUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }
}
