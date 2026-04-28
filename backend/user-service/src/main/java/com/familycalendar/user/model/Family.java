package com.familycalendar.user.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "families")
@Data
@NoArgsConstructor
public class Family {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    private String inviteCode;

    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> members = new ArrayList<>();

    @PrePersist
    public void generateInviteCode() {
        this.inviteCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
