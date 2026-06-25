package com.todolist.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_roles")
public class User_Role {
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "id")
	    private Long id;

	    @ManyToOne
	    @JoinColumn(name = "user_id", referencedColumnName = "id")
	    private User user;

	    @ManyToOne
	    @JoinColumn(name = "role_id", referencedColumnName = "id")
	    private Role role;
}
