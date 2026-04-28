package com.familycalendar.calendar.dto;

import com.familycalendar.calendar.model.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequest {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean allDay;
    private String color;
    private Event.EventType type = Event.EventType.PERSONAL;
}
