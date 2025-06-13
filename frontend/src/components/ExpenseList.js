import React, { useState } from "react";
import axios from "axios";

function ExpenseList({ expenses, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const toggleDescription = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleDelete = async (expense) => {
    if (window.confirm(`Are you sure you want to delete this expense: $${expense.amount} for ${expense.category}?`)) {
      setDeletingId(expense.id);
      
      try {
        await axios.delete(`http://localhost:8080/api/expenses/${expense.id}`);
        onDelete(expense.id);
      } catch (error) {
        console.error("Failed to delete expense:", error);
        alert("Failed to delete expense. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const categoryColors = {
    Food: "#f87171",
    Transportation: "#60a5fa",
    Rent: "#facc15",
    Utilities: "#34d399",
    Entertainment: "#a78bfa",
    Health: "#f472b6",
    Other: "#9ca3af"
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "40px", 
        color: "#6b7280",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        margin: "20px 0"
      }}>
        <h3>No expenses yet</h3>
        <p>Add your first expense using the form above!</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "15px",
        padding: "10px",
        backgroundColor: "#f3f4f6",
        borderRadius: "6px"
      }}>
        <h2>Expenses ({expenses.length})</h2>
        <div style={{ 
          fontSize: "18px", 
          fontWeight: "bold",
          color: "#059669"
        }}>
          Total: {formatAmount(total)}
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {expenses.map((expense) => (
          <li 
            key={expense.id}
            style={{ 
              marginBottom: "12px",
              padding: "15px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "8px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span style={{ 
                  color: "#374151", 
                  fontWeight: "500",
                  minWidth: "100px"
                }}>
                  {formatDate(expense.date)}
                </span>
                
                <span
                  style={{
                    backgroundColor: categoryColors[expense.category] || "#e5e7eb",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    minWidth: "80px",
                    textAlign: "center"
                  }}
                >
                  {expense.category}
                </span>
                
                <span style={{ 
                  fontSize: "18px", 
                  fontWeight: "600",
                  color: "#059669",
                  minWidth: "80px"
                }}>
                  {formatAmount(expense.amount)}
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                {expense.description && (
                  <button 
                    onClick={() => toggleDescription(expense.id)}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      padding: "4px 8px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    {expandedId === expense.id ? "Hide" : "Show"} Details
                  </button>
                )}
                
                <button
                  onClick={() => onEdit(expense)}
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(expense)}
                  disabled={deletingId === expense.id}
                  style={{
                    backgroundColor: deletingId === expense.id ? "#9ca3af" : "#ef4444",
                    color: "white",
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: deletingId === expense.id ? "not-allowed" : "pointer",
                    fontSize: "12px"
                  }}
                >
                  {deletingId === expense.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            {expandedId === expense.id && expense.description && (
              <div style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#f9fafb",
                borderRadius: "4px",
                color: "#374151",
                fontSize: "14px",
                borderLeft: "4px solid #d1d5db"
              }}>
                <strong>Description:</strong> {expense.description}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;