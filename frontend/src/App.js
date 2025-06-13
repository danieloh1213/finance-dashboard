import React, { useEffect, useState } from "react";
import axios from "axios";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import FilterBar from "./components/FilterBar";
import Analytics from "./components/Analytics";
import SimpleAnalyticsTest from "./components/SimpleAnalyticsTest";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCharts, setShowCharts] = useState(true); // Move chart toggle state here

  // Fetch expenses and categories on component mount
  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  // Update filtered expenses when expenses change
  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/expenses");
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
      setError("Failed to load expenses. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      const categoryNames = response.data.map(cat => cat.name);
      setCategories(categoryNames);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories(["Food", "Transportation", "Rent", "Utilities", "Entertainment", "Health", "Other"]);
    }
  };

  // Filter expenses based on criteria
  const filterExpenses = (filters) => {
    let filtered = [...expenses];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(expense => expense.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(expense => expense.date <= filters.dateTo);
    }

    // Filter by amount range
    if (filters.minAmount) {
      const minAmount = parseFloat(filters.minAmount);
      filtered = filtered.filter(expense => expense.amount >= minAmount);
    }
    if (filters.maxAmount) {
      const maxAmount = parseFloat(filters.maxAmount);
      filtered = filtered.filter(expense => expense.amount <= maxAmount);
    }

    // Filter by search text in description
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.description && expense.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredExpenses(filtered);
  };

  const handleFiltersChange = (filters) => {
    filterExpenses(filters);
  };

  const handleAdd = (expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const handleUpdate = (updatedExpense) => {
    setExpenses((prev) => 
      prev.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const handleDelete = (expenseId) => {
    setExpenses((prev) => prev.filter(expense => expense.id !== expenseId));
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleCategoriesChange = async (newCategories) => {
    const oldCategories = [...categories];
    
    try {
      const added = newCategories.filter(cat => !categories.includes(cat));
      const removed = categories.filter(cat => !newCategories.includes(cat));
      
      for (const categoryName of added) {
        await axios.post("http://localhost:8080/api/categories", { name: categoryName });
      }
      
      for (const categoryName of removed) {
        const response = await axios.get("http://localhost:8080/api/categories");
        const categoryToDelete = response.data.find(cat => cat.name === categoryName);
        if (categoryToDelete) {
          await axios.delete(`http://localhost:8080/api/categories/${categoryToDelete.id}`);
        }
      }
      
      setCategories(newCategories);
      
    } catch (error) {
      console.error("Failed to update categories:", error);
      setCategories(oldCategories);
      
      if (error.response?.status === 409) {
        alert("Category already exists!");
      } else {
        alert("Failed to update categories. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "200px",
        fontSize: "18px",
        color: "#6b7280"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "1800px", // Wider than before but not full screen
      margin: "0 auto", // Center it
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
    }}>
      <header style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        borderBottom: "2px solid #e5e7eb",
        paddingBottom: "20px"
      }}>
        <h1 style={{ 
          color: "#111827", 
          fontSize: "32px",
          margin: "0 0 10px 0"
        }}>
          💰 Finance Dashboard
        </h1>
        <p style={{ 
          color: "#6b7280", 
          fontSize: "16px",
          margin: 0
        }}>
          Track your expenses and manage your budget
        </p>
      </header>

      {error && (
        <div style={{
          backgroundColor: "#fee2e2",
          color: "#dc2626",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          {error}
          <button
            onClick={fetchExpenses}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              padding: "4px 8px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "10px",
              fontSize: "12px"
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1.2fr 0.8fr", // More balanced - left side less wide, right side wider
        gap: "30px"
      }}>
        {/* LEFT SIDE - Expenses */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <section style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb"
          }}>
            <ExpenseForm
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              editingExpense={editingExpense}
              onCancelEdit={handleCancelEdit}
              categories={categories}
              onCategoriesChange={handleCategoriesChange}
            />
          </section>

          <section style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb"
          }}>
            <FilterBar 
              categories={categories}
              onFiltersChange={handleFiltersChange}
            />
            
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        </div>

        {/* RIGHT SIDE - Analytics */}
        <div>
          <section style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
            position: "sticky", // Makes analytics stick when scrolling
            top: "20px"
          }}>
            <Analytics 
              expenses={filteredExpenses}
              showCharts={showCharts}
              setShowCharts={setShowCharts}
            />
          </section>
        </div>
      </div>

      <footer style={{
        textAlign: "center",
        marginTop: "40px",
        padding: "20px",
        color: "#9ca3af",
        fontSize: "14px"
      }}>
        <p>💡 Tip: Use filters to find specific expenses quickly!</p>
      </footer>
    </div>
  );
}

export default App;