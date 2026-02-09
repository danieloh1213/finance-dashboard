package com.finance.financedashboard.controller;

import com.finance.financedashboard.model.Expense;
import com.finance.financedashboard.repository.ExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "${ALLOWED_ORIGIN}")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @GetMapping
    public List<Expense> getAllExpenses(Authentication authentication) {

        Long userId = (Long) authentication.getPrincipal();

        return expenseRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense, Authentication authentication) {
        if (expense.getCategory() == null || expense.getCategory().trim().isEmpty()) {
            return ResponseEntity.<Expense>badRequest().build();
        }
        if (expense.getAmount() == null || expense.getAmount().doubleValue() <= 0) {
            return ResponseEntity.<Expense>badRequest().build();
        }
        if (expense.getDate() == null) {
            return ResponseEntity.<Expense>badRequest().build();
        }
        Long userId = (Long) authentication.getPrincipal();
        expense.setUserId(userId);
        try {
            Expense savedExpense = expenseRepository.save(expense);
            return ResponseEntity.ok(savedExpense);
        } catch (Exception e) {
            return ResponseEntity.<Expense>status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        
        if (expenseDetails.getCategory() == null || expenseDetails.getCategory().trim().isEmpty()) {
            return ResponseEntity.<Expense>badRequest().build();
        }
        if (expenseDetails.getAmount() == null || expenseDetails.getAmount().doubleValue() <= 0) {
            return ResponseEntity.<Expense>badRequest().build();
        }
        if (expenseDetails.getDate() == null) {
            return ResponseEntity.<Expense>badRequest().build();
        }

        try {
            return expenseRepository.findById(id)
                .filter(expense -> expense.getUserId().equals(userId))
                .map(expense -> {
                    expense.setDescription(expenseDetails.getDescription());
                    expense.setAmount(expenseDetails.getAmount());
                    expense.setCategory(expenseDetails.getCategory());
                    expense.setDate(expenseDetails.getDate());
                    return ResponseEntity.ok(expenseRepository.save(expense));
                })
                .orElse(ResponseEntity.<Expense>notFound().build());
        } catch (Exception e) {
            return ResponseEntity.<Expense>status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        try {
            return expenseRepository.findById(id)
                .filter(expense -> expense.getUserId().equals(userId))
                .map(expense -> {
                    expenseRepository.delete(expense);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.<Void>status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}