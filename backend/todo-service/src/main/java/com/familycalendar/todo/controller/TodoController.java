package com.familycalendar.todo.controller;

import com.familycalendar.todo.dto.TodoRequest;
import com.familycalendar.todo.model.TodoItem;
import com.familycalendar.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @PostMapping
    public ResponseEntity<TodoItem> createTodo(
            @Valid @RequestBody TodoRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Name", defaultValue = "") String userName,
            @RequestHeader("X-Family-Id") String familyId) {
        return ResponseEntity.ok(todoService.createTodo(request, userId, userName, familyId));
    }

    @GetMapping
    public ResponseEntity<List<TodoItem>> getFamilyTodos(
            @RequestHeader("X-Family-Id") String familyId) {
        return ResponseEntity.ok(todoService.getFamilyTodos(familyId));
    }

    @PatchMapping("/{todoId}/toggle")
    public ResponseEntity<TodoItem> toggleComplete(
            @PathVariable String todoId,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(todoService.toggleComplete(todoId, userId));
    }

    @PutMapping("/{todoId}")
    public ResponseEntity<TodoItem> updateTodo(
            @PathVariable String todoId,
            @Valid @RequestBody TodoRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(todoService.updateTodo(todoId, request, userId));
    }

    @DeleteMapping("/{todoId}")
    public ResponseEntity<Void> deleteTodo(
            @PathVariable String todoId,
            @RequestHeader("X-User-Id") String userId) {
        todoService.deleteTodo(todoId, userId);
        return ResponseEntity.noContent().build();
    }
}
