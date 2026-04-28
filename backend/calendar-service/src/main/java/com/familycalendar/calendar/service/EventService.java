package com.familycalendar.calendar.service;

import com.familycalendar.calendar.dto.EventRequest;
import com.familycalendar.calendar.model.Event;
import com.familycalendar.calendar.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Event createEvent(EventRequest request, String userId, String userName, String familyId) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setAllDay(request.isAllDay());
        event.setColor(request.getColor());
        event.setType(request.getType());
        event.setFamilyId(familyId);
        event.setCreatedByUserId(userId);
        event.setCreatedByUserName(userName);
        return eventRepository.save(event);
    }

    public List<Event> getFamilyEvents(String familyId) {
        return eventRepository.findByFamilyIdOrderByStartTimeAsc(familyId);
    }

    public List<Event> getFamilyEventsByRange(String familyId, LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByFamilyIdAndDateRange(familyId, start, end);
    }

    public Event updateEvent(String eventId, EventRequest request, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (!event.getCreatedByUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this event");
        }
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setAllDay(request.isAllDay());
        event.setColor(request.getColor());
        event.setType(request.getType());
        return eventRepository.save(event);
    }

    public void deleteEvent(String eventId, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (!event.getCreatedByUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this event");
        }
        eventRepository.delete(event);
    }
}
