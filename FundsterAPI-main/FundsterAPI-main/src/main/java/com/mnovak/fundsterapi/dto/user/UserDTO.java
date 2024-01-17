package com.mnovak.fundsterapi.dto.user;

import com.mnovak.fundsterapi.dto.project.ProjectDTO;
import com.mnovak.fundsterapi.enumeration.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Integer id;
    private String name;
    private String email;
    private Role role;
    private String profilePictureUrl;
    private String phoneNumber;
    private String password;
    private List<ProjectDTO> projects;
    private List<ProjectDTO> favouriteProjects;
}
