package com.mnovak.fundsterapi.service;

import com.mnovak.fundsterapi.dto.project.CreateProjectDTO;
import com.mnovak.fundsterapi.dto.project.ProjectDTO;
import com.mnovak.fundsterapi.entity.Project;
import com.mnovak.fundsterapi.entity.User;
import com.mnovak.fundsterapi.repository.ProjectRepository;
import com.mnovak.fundsterapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public List<ProjectDTO> getProjects() {
        Iterable<Project> projects = projectRepository.findAll();
        List<ProjectDTO> projectDTOS = new ArrayList<>();

        for(Project project: projects) {
            projectDTOS.add(mapProjectToDto(project));
        }
        return projectDTOS;
    }
    public List<ProjectDTO> getUserProjects(Integer id) {
        Iterable<Project> projects = projectRepository.findAll();
        List<ProjectDTO> projectDTOS = new ArrayList<>();

        for(Project project: projects) {
            if(project.getUser().getId().equals(id)) {
                projectDTOS.add(mapProjectToDto(project));
            }
        }
        return projectDTOS;
    }

    public ProjectDTO getProject(Integer id) {
        Project project = getProjectEntity(id);
        return mapProjectToDto(project);
    }

    public ProjectDTO createProject(CreateProjectDTO projectDTO) {
        User user = userService.getUserFromDatabase(projectDTO.getUserID());
        Project project = Project
                .builder()
                .name(projectDTO.getName())
                .description(projectDTO.getDescription())
                .projectPictureUrl(projectDTO.getProjectPictureUrl())
                .moneyGoal(projectDTO.getMoneyGoal())
                .deadline(projectDTO.getDeadline())
                .user(user)
                .build();

        projectRepository.save(project);

        return mapProjectToDto(project);
    }
    public void updateProject(Integer id,Project project) {
        Project projectToUpdate = getProjectEntity(id);

        projectToUpdate.setName(project.getName());
        projectToUpdate.setDescription(project.getDescription());
        projectToUpdate.setProjectPictureUrl(project.getProjectPictureUrl());
        projectToUpdate.setBackers(project.getBackers());
        projectToUpdate.setDeadline(project.getDeadline());
        projectToUpdate.setMoneyAcquired(project.getMoneyAcquired());
        projectToUpdate.setMoneyGoal(project.getMoneyGoal());

        projectRepository.save(projectToUpdate);
    }

    public void deleteProject(Integer id) {
        Project project = getProjectEntity(id);
        projectRepository.delete(project);
    }

    private Project getProjectEntity(Integer id) {
        return projectRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Project was not found!"));
    }

    private ProjectDTO mapProjectToDto(Project project) {
        return ProjectDTO
                .builder()
                .id(project.getId())
                .name(project.getName())
                .moneyAcquired(project.getMoneyAcquired())
                .moneyGoal(project.getMoneyGoal())
                .projectPictureUrl(project.getProjectPictureUrl())
                .userID(project.getUser().getId())
                .backers(project.getBackers())
                .description(project.getDescription())
                .deadline(project.getDeadline())
                .build();
    }
}
