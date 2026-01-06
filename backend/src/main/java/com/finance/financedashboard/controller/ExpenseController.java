package com.finance.financedashboard.controller;

import com.finance.financedashboard.model.Expense;
import com.finance.financedashboard.repository.ExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "${ALLOWED_ORIGIN}")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) {
        if (expense.getCategory() == null || expense.getCategory().trim().isEmpty()) {
            return ResponseEntity.<Expense>badRequest().build();
        }
        if (expense.getAmount() == null || expense.getAmount().doubleValue() <= 0) {
            return ResponseEntity.<Expense>badRequest().build();
        }
        if (expense.getDate() == null) {
            return ResponseEntity.<Expense>badRequest().build();
        }

        try {
            Expense savedExpense = expenseRepository.save(expense);
            return ResponseEntity.ok(savedExpense);
        } catch (Exception e) {
            return ResponseEntity.<Expense>status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails) {
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
            Optional<Expense> optionalExpense = expenseRepository.findById(id);

            if (optionalExpense.isPresent()) {
                Expense expense = optionalExpense.get();
                expense.setCategory(expenseDetails.getCategory().trim());
                expense.setAmount(expenseDetails.getAmount());
                expense.setDate(expenseDetails.getDate());
                expense.setDescription(expenseDetails.getDescription());

                Expense updatedExpense = expenseRepository.save(expense);
                return ResponseEntity.ok(updatedExpense);
            } else {
                return ResponseEntity.<Expense>notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.<Expense>status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        try {
            if (expenseRepository.existsById(id)) {
                expenseRepository.deleteById(id);
                return ResponseEntity.noContent().build(); // 204 No Content
            } else {
                return ResponseEntity.<Void>notFound().build(); // 404 Not Found
            }
        } catch (Exception e) {
            return ResponseEntity.<Void>status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}