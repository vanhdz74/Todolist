package com.vihotask.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Getter
@Setter
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "email",unique = true)
    private String email;

    @Column(name = "password")
    private String passwordHash;

    @Column(name = "phone")
    private String phone;

    @Column(name = "avatarUrl")
    private String avatarUrl;

    @Column(name = "status")
    private Boolean status = Boolean.TRUE;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // RELATION

//    @OneToMany(mappedBy = "owner")
//    private List<Workspace> ownedWorkspaces;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User_Role> userRole = new ArrayList<>();

//    @OneToMany(mappedBy = "user")
//    private List<WorkspaceMember> workspaceMembers;
//
//    @OneToMany(mappedBy = "user")
//    private List<Comment> comments;
//
//    @OneToMany(mappedBy = "user")
//    private List<Notification> notifications;
//
//    @OneToMany(mappedBy = "user")
//    private List<ActivityLog> activityLogs;

    // Lấy danh sách role, phải extend UserDetails của security để sử dụng
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return userRole.stream()
//                .map(userRole -> new SimpleGrantedAuthority(
//                        "ROLE_" + userRole.getRole().getName().toUpperCase()
//                ))
//                .collect(Collectors.toList());
//    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (userRole == null) return Collections.emptyList();

        return userRole.stream()
                .map(ur -> new SimpleGrantedAuthority(
                        "ROLE_" + ur.getRole().getName().toUpperCase()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}