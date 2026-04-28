package com.fliply.repository;

import com.fliply.model.DeckShareImport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeckShareImportRepository extends JpaRepository<DeckShareImport, Long> {
    List<DeckShareImport> findByShareId(Long shareId);
    long countByShareId(Long shareId);
}
