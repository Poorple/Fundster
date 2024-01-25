package com.mnovak.fundsterapi.dto.user;

import com.mnovak.fundsterapi.enumeration.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserDTO {
    private String name;
    private String email;
    private Role role;
    private String profilePictureUrl;
    private String phoneNumber;
    private String password;
}
