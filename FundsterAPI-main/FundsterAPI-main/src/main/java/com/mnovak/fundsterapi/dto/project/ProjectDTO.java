package com.mnovak.fundsterapi.dto.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDTO {
    private Integer id;
    private String name;
    private String projectPictureUrl;
    private String description;
    private Integer moneyGoal;
    private Integer moneyAcquired;
    private Integer backers;
    private Date deadline;
    private Integer userID;
}
