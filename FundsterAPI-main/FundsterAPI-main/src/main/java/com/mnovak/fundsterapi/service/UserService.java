package com.mnovak.fundsterapi.service;

import com.mnovak.fundsterapi.dto.project.ProjectDTO;
import com.mnovak.fundsterapi.dto.user.AuthDTO;
import com.mnovak.fundsterapi.dto.user.CreateUserDTO;
import com.mnovak.fundsterapi.dto.user.UserDTO;
import com.mnovak.fundsterapi.dto.user.UserLoginDTO;
import com.mnovak.fundsterapi.entity.User;
import com.mnovak.fundsterapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    public AuthDTO login(UserLoginDTO userLoginDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLoginDTO.getEmail(),
                        userLoginDTO.getPassword()
                )
        );
        User user = userRepository.findByEmail(userLoginDTO.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String jwt = jwtService.generateJwt(user,user.getId());

        return AuthDTO
                .builder()
                .token(jwt)
                .build();
    }

    public List<UserDTO> getUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOS = new ArrayList<>();
        for (User user: users) {
            userDTOS.add(mapUserToDto(user));
        }
        return userDTOS;
    }

    public UserDTO getUser(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No user with that id!"));
        return mapUserToDto(user);
    }

    public UserDTO insertUser(CreateUserDTO createUserDTO) {
        User user = User
                .builder()
                .email(createUserDTO.getEmail())
                .name(createUserDTO.getName())
                .phoneNumber(createUserDTO.getPhoneNumber())
                .password(passwordEncoder.encode(createUserDTO.getPassword()))
                .role(createUserDTO.getRole())
                .profilePictureUrl(createUserDTO.getProfilePictureUrl())
                .build();

        userRepository.save(user);
        return mapUserToDto(user);
    }

    public void updateUser(Integer id, User user) {
        User userToUpdate = getUserFromDatabase(id);

        userToUpdate.setName(user.getName());
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setPhoneNumber(user.getPhoneNumber());
        userToUpdate.setProfilePictureUrl(user.getProfilePictureUrl());
        userToUpdate.setFavouriteProjects(user.getFavouriteProjects());
        userToUpdate.setProjects(user.getProjects());

        userRepository.save(userToUpdate);
    }

    public void deleteUser(Integer id) {
        User user = getUserFromDatabase(id);
        userRepository.delete(user);
    }

    public User getUserFromDatabase(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"User was not found!"));
    }
    private UserDTO mapUserToDto(User user) {
        List<ProjectDTO> userProjects = new ArrayList<>();
        List<ProjectDTO> favouriteProjects = new ArrayList<>();

        if(user.getProjects() != null) {
            userProjects = user
                    .getProjects()
                    .stream()
                    .map(p -> ProjectDTO
                            .builder()
                            .id(p.getId())
                            .name(p.getName())
                            .description(p.getDescription())
                            .backers(p.getBackers())
                            .projectPictureUrl(p.getProjectPictureUrl())
                            .moneyGoal(p.getMoneyGoal())
                            .moneyAcquired(p.getMoneyAcquired())
                            .deadline(p.getDeadline())
                            .userID(user.getId())
                            .build())
                    .collect(Collectors.toList());
        }

        if(user.getFavouriteProjects() != null) {
            favouriteProjects = user
                    .getProjects()
                    .stream()
                    .map(p -> ProjectDTO
                            .builder()
                            .id(p.getId())
                            .name(p.getName())
                            .description(p.getDescription())
                            .backers(p.getBackers())
                            .projectPictureUrl(p.getProjectPictureUrl())
                            .moneyGoal(p.getMoneyGoal())
                            .moneyAcquired(p.getMoneyAcquired())
                            .deadline(p.getDeadline())
                            .build())
                    .collect(Collectors.toList());
        }

        return UserDTO
                .builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .password(user.getPassword())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .profilePictureUrl(user.getProfilePictureUrl())
                .projects(userProjects)
                .favouriteProjects(favouriteProjects)
                .build();
    }
}
