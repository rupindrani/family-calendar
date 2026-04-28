package com.familycalendar.calendar.repository;

import com.familycalendar.calendar.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findByFamilyIdOrderByStartTimeAsc(String familyId);

    @Query("SELECT e FROM Event e WHERE e.familyId = :familyId AND e.startTime >= :start AND e.startTime <= :end ORDER BY e.startTime ASC")
    List<Event> findByFamilyIdAndDateRange(String familyId, LocalDateTime start, LocalDateTime end);

    List<Event> findByFamilyIdAndCreatedByUserId(String familyId, String userId);
}
