package com.familycalendar.user.repository;

import com.familycalendar.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByFamilyId(String familyId);
    boolean existsByEmail(String email);
}
