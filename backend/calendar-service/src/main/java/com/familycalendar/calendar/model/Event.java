package com.familycalendar.calendar.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private boolean allDay;

    @Column(nullable = false)
    private String familyId;

    @Column(nullable = false)
    private String createdByUserId;

    private String createdByUserName;

    private String color;

    @Enumerated(EnumType.STRING)
    private EventType type = EventType.PERSONAL;

    public enum EventType {
        PERSONAL, FAMILY, HOLIDAY
    }
}
