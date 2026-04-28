package com.familycalendar.todo.service;

import com.familycalendar.todo.dto.TodoRequest;
import com.familycalendar.todo.model.TodoItem;
import com.familycalendar.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoItem createTodo(TodoRequest request, String userId, String userName, String familyId) {
        TodoItem todo = new TodoItem();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setDueDate(request.getDueDate());
        todo.setPriority(request.getPriority());
        todo.setFamilyId(familyId);
        todo.setCreatedByUserId(userId);
        todo.setCreatedByUserName(userName);
        todo.setAssignedToUserId(request.getAssignedToUserId());
        todo.setAssignedToUserName(request.getAssignedToUserName());
        return todoRepository.save(todo);
    }

    public List<TodoItem> getFamilyTodos(String familyId) {
        return todoRepository.findByFamilyIdOrderByCreatedAtDesc(familyId);
    }

    public TodoItem toggleComplete(String todoId, String userId) {
        TodoItem todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        boolean isCreator = todo.getCreatedByUserId().equals(userId);
        boolean isAssignee = userId.equals(todo.getAssignedToUserId());
        if (!isCreator && !isAssignee) {
            throw new RuntimeException("Not authorized");
        }
        todo.setCompleted(!todo.isCompleted());
        todo.setCompletedAt(todo.isCompleted() ? LocalDateTime.now() : null);
        return todoRepository.save(todo);
    }

    public TodoItem updateTodo(String todoId, TodoRequest request, String userId) {
        TodoItem todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        if (!todo.getCreatedByUserId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setDueDate(request.getDueDate());
        todo.setPriority(request.getPriority());
        todo.setAssignedToUserId(request.getAssignedToUserId());
        todo.setAssignedToUserName(request.getAssignedToUserName());
        return todoRepository.save(todo);
    }

    public void deleteTodo(String todoId, String userId) {
        TodoItem todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        if (!todo.getCreatedByUserId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        todoRepository.delete(todo);
    }
}