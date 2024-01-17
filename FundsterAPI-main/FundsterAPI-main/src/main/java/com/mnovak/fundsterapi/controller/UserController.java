package com.mnovak.fundsterapi.controller;

import com.mnovak.fundsterapi.dto.project.ProjectDTO;
import com.mnovak.fundsterapi.dto.user.AuthDTO;
import com.mnovak.fundsterapi.dto.user.CreateUserDTO;
import com.mnovak.fundsterapi.dto.user.UserDTO;
import com.mnovak.fundsterapi.dto.user.UserLoginDTO;
import com.mnovak.fundsterapi.entity.User;
import com.mnovak.fundsterapi.service.ProjectService;
import com.mnovak.fundsterapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/users")
public class UserController {

    private final UserService userService;
    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<UserDTO> userDTOS = userService.getUsers();
        return ResponseEntity.ok(userDTOS);
    }

    @GetMapping("/{id}/Projects")
    public ResponseEntity<List<ProjectDTO>> getUserProjects(@PathVariable Integer id) {
        List<ProjectDTO> userProjects = projectService.getUserProjects(id);
        return ResponseEntity.ok(userProjects);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTO> loginUser(@RequestBody UserLoginDTO userLoginDTO) {
        AuthDTO authDTO = userService.login(userLoginDTO);

        return ResponseEntity.ok(authDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Integer id) {
        UserDTO userDTO = userService.getUser(id);

        return ResponseEntity.ok(userDTO);
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserDTO createUserDTO) {
        UserDTO userDTO = userService.insertUser(createUserDTO);

        return ResponseEntity.created(URI.create("api/users" + userDTO.getId())).body(userDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody User user) {
        userService.updateUser(id,user);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

}
