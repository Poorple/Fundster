package com.mnovak.fundsterapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String projectPictureUrl;
    private String description;
    private Integer moneyGoal;
    private Integer moneyAcquired;
    private Integer backers;
    private Date deadline;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
