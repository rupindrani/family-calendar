package com.familycalendar.user.dto;

import lombok.Data;

@Data
public class UserDto {
    private String id;
    private String name;
    private String email;
    private String avatarColor;
    private String familyId;
}
