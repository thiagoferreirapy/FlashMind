package com.flashmind.dto;

import com.flashmind.model.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String whatsappPhone;
    private String avatarUrl;
    private String timezone;
    private LocalDateTime createdAt;

    public static UserDto from(User u) {
        UserDto dto = new UserDto();
        dto.setId(u.getId());
        dto.setName(u.getName());
        dto.setEmail(u.getEmail());
        dto.setWhatsappPhone(u.getWhatsappPhone());
        dto.setAvatarUrl(u.getAvatarUrl());
        dto.setTimezone(u.getTimezone());
        dto.setCreatedAt(u.getCreatedAt());
        return dto;
    }
}
