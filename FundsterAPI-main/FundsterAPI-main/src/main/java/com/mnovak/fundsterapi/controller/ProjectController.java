package com.mnovak.fundsterapi.controller;

import com.mnovak.fundsterapi.dto.project.CreateProjectDTO;
import com.mnovak.fundsterapi.dto.project.ProjectDTO;
import com.mnovak.fundsterapi.entity.Project;
import com.mnovak.fundsterapi.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getProjects() {
        List<ProjectDTO> projects = projectService.getProjects();

        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable Integer id) {
        ProjectDTO project = projectService.getProject(id);

        return ResponseEntity.ok(project);
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody CreateProjectDTO createProjectDTO) {
        ProjectDTO projectDTO = projectService.createProject(createProjectDTO);

        return ResponseEntity.created(URI.create("api/projects" + projectDTO.getId())).body(projectDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Integer id, @RequestBody Project project) {
        projectService.updateProject(id,project);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);

        return ResponseEntity.noContent().build();
    }
}
