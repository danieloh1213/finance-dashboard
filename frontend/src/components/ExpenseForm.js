import React, { useState, useEffect } from "react";
import axios from "axios";

function ExpenseForm({ onAdd, onUpdate, editingExpense, onCancelEdit, categories, onCategoriesChange }) {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    description: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Load editing expense data
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        category: editingExpense.category,
        amount: editingExpense.amount.toString(),
        date: editingExpense.date,
        description: editingExpense.description || ""
      });
      setErrors({});
    }
  }, [editingExpense]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingExpense) {
        // Update existing expense
        const response = await axios.put(`http://localhost:8080/api/expenses/${editingExpense.id}`, expenseData);
        onUpdate(response.data);
        onCancelEdit();
      } else {
        // Add new expense
        const response = await axios.post("http://localhost:8080/api/expenses", expenseData);
        onAdd(response.data);
      }
      
      // Reset form
      setFormData({ category: "", amount: "", date: "", description: "" });
      setErrors({});
      
    } catch (error) {
      console.error("Failed to submit:", error);
      setErrors({ submit: error.response?.data?.message || "Failed to save expense. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      onCategoriesChange(updatedCategories);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (categories.length > 1) { // Keep at least one category
      const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
      onCategoriesChange(updatedCategories);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>{editingExpense ? "Edit Expense" : "Add New Expense"}</h2>
      
      {errors.submit && (
        <div style={{ 
          backgroundColor: "#fee2e2", 
          color: "#dc2626", 
          padding: "8px", 
          borderRadius: "4px", 
          marginBottom: "10px" 
        }}>
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: errors.category ? "2px solid #dc2626" : "1px solid #d1d5db",
              marginRight: "10px"
            }}
          >
            <option value="">-- Select a category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <button
            type="button"
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            style={{
              backgroundColor: "#6b7280",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Manage Categories
          </button>
          
          {errors.category && (
            <div style={{ color: "#dc2626", fontSize: "14px", marginTop: "4px" }}>
              {errors.category}
            </div>
          )}
        </div>

        {showCategoryManager && (
          <div style={{ 
            backgroundColor: "#f9fafb", 
            padding: "15px", 
            borderRadius: "8px", 
            marginBottom: "15px" 
          }}>
            <h3>Manage Categories</h3>
            
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                style={{ padding: "6px", marginRight: "8px" }}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Add Category
              </button>
            </div>
            
            <div>
              <strong>Current Categories:</strong>
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                {categories.map(cat => (
                  <li key={cat} style={{ marginBottom: "4px" }}>
                    {cat}
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        style={{
                          backgroundColor: "#ef4444",
                          color: "white",
                          padding: "2px 6px",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer",
                          marginLeft: "8px",
                          fontSize: "12px"
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div style={{ marginBottom: "10px" }}>
          <input 
            name="amount" 
            type="number" 
            step="0.01"
            value={formData.amount} 
            onChange={handleChange} 
            placeholder="Amount" 
            required 
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: errors.amount ? "2px solid #dc2626" : "1px solid #d1d5db",
              marginRight: "10px"
            }}
          />
          {errors.amount && (
            <div style={{ color: "#dc2626", fontSize: "14px", marginTop: "4px" }}>
              {errors.amount}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input 
            name="date" 
            type="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: errors.date ? "2px solid #dc2626" : "1px solid #d1d5db",
              marginRight: "10px"
            }}
          />
          {errors.date && (
            <div style={{ color: "#dc2626", fontSize: "14px", marginTop: "4px" }}>
              {errors.date}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Description (optional)" 
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: errors.description ? "2px solid #dc2626" : "1px solid #d1d5db",
              width: "300px"
            }}
          />
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
            {formData.description.length}/200 characters
          </div>
          {errors.description && (
            <div style={{ color: "#dc2626", fontSize: "14px", marginTop: "4px" }}>
              {errors.description}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#9ca3af" : "#2563eb",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            marginRight: "10px"
          }}
        >
          {loading ? "Saving..." : (editingExpense ? "Update Expense" : "Add Expense")}
        </button>

        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            style={{
              backgroundColor: "#6b7280",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default ExpenseForm;