package com.finance.financedashboard.controller;

import com.finance.financedashboard.model.Category;
import com.finance.financedashboard.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.<Category>badRequest().build();
        }

        try { // duplicate name error catching
            category.setName(category.getName().trim());
            Category savedCategory = categoryRepository.save(category);
            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            return ResponseEntity.<Category>status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        if (categoryDetails.getName() == null || categoryDetails.getName().trim().isEmpty()) {
            return ResponseEntity.<Category>badRequest().build();
        }

        try { // duplicate name error catching
            Optional<Category> optionalCategory = categoryRepository.findById(id);

            if (optionalCategory.isPresent()) {
                Category category = optionalCategory.get();
                category.setName(categoryDetails.getName().trim());

                Category updatedCategory = categoryRepository.save(category);
                return ResponseEntity.ok(updatedCategory);
            } else {
                return ResponseEntity.<Category>notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.<Category>status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            if (categoryRepository.existsById(id)) {
                categoryRepository.deleteById(id);
                return ResponseEntity.<Void>noContent().build(); // 204 No Content
            } else {
                return ResponseEntity.<Void>notFound().build(); // 404 Not Found
            }
        } catch (Exception e) {
            return ResponseEntity.<Void>status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}