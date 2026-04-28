package com.familycalendar.todo.dto;

import com.familycalendar.todo.model.TodoItem;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TodoRequest {
    @NotBlank
    private String title;
    private String description;
    private LocalDate dueDate;
    private TodoItem.Priority priority = TodoItem.Priority.MEDIUM;
    private String assignedToUserId;
    private String assignedToUserName;
}
