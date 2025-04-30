package com.finance.financedashboard.repository;

import com.finance.financedashboard.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

}
