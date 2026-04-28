package com.familycalendar.todo.repository;

import com.familycalendar.todo.model.TodoItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<TodoItem, String> {
    List<TodoItem> findByFamilyIdOrderByCreatedAtDesc(String familyId);
    List<TodoItem> findByFamilyIdAndAssignedToUserId(String familyId, String userId);
    List<TodoItem> findByFamilyIdAndCompleted(String familyId, boolean completed);
}
