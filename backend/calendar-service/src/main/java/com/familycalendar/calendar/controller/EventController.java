package com.familycalendar.calendar.controller;

import com.familycalendar.calendar.dto.EventRequest;
import com.familycalendar.calendar.model.Event;
import com.familycalendar.calendar.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<Event> createEvent(
            @Valid @RequestBody EventRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Name", defaultValue = "") String userName,
            @RequestHeader("X-Family-Id") String familyId) {
        return ResponseEntity.ok(eventService.createEvent(request, userId, userName, familyId));
    }

    @GetMapping
    public ResponseEntity<List<Event>> getFamilyEvents(
            @RequestHeader("X-Family-Id") String familyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        if (start != null && end != null) {
            return ResponseEntity.ok(eventService.getFamilyEventsByRange(familyId, start, end));
        }
        return ResponseEntity.ok(eventService.getFamilyEvents(familyId));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable String eventId,
            @Valid @RequestBody EventRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(eventService.updateEvent(eventId, request, userId));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable String eventId,
            @RequestHeader("X-User-Id") String userId) {
        eventService.deleteEvent(eventId, userId);
        return ResponseEntity.noContent().build();
    }
}
