package com.finance.financedashboard.controller;

import com.finance.financedashboard.model.Category;
import com.finance.financedashboard.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "${ALLOWED_ORIGIN}")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> getAllCategories(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return categoryRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category, Authentication authentication) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.<Category>badRequest().build();
        }
        Long userId = (Long) authentication.getPrincipal();
        category.setUserId(userId);
        return ResponseEntity.ok(categoryRepository.save(category));
    }
   

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        
        return categoryRepository.findById(id)
            .filter(category -> category.getUserId().equals(userId))
            .map(category -> {
                categoryRepository.delete(category);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}