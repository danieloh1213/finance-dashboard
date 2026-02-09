package com.finance.financedashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.finance.financedashboard.model.Category;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);
}
