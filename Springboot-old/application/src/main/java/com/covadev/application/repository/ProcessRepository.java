package com.covadev.application.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.covadev.application.model.ProcessEntity;

@Repository
public interface ProcessRepository extends JpaRepository<ProcessEntity, Long> {
}

