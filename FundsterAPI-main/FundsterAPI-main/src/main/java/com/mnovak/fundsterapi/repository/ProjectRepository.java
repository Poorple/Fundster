package com.mnovak.fundsterapi.repository;

import com.mnovak.fundsterapi.entity.Project;
import org.springframework.data.repository.CrudRepository;

public interface ProjectRepository extends CrudRepository<Project, Integer> {
}
