import React, { useState } from "react";

function FilterBar({ categories, onFiltersChange }) {
  const [filters, setFilters] = useState({
    category: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    searchText: ""
  });

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      category: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      searchText: ""
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div style={{
      backgroundColor: "#f8fafc",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px",
      border: "1px solid #e2e8f0"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "15px"
      }}>
        <h3 style={{ margin: 0, color: "#374151" }}>Filter Expenses</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "4px 8px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        alignItems: "end"
      }}>
        {/* Category Filter */}
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "4px", 
            fontSize: "14px", 
            fontWeight: "500",
            color: "#374151"
          }}>
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "14px"
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "4px", 
            fontSize: "14px", 
            fontWeight: "500",
            color: "#374151"
          }}>
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Date To */}
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "4px", 
            fontSize: "14px", 
            fontWeight: "500",
            color: "#374151"
          }}>
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Min Amount */}
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "4px", 
            fontSize: "14px", 
            fontWeight: "500",
            color: "#374151"
          }}>
            Min Amount
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="$0.00"
            value={filters.minAmount}
            onChange={(e) => handleFilterChange("minAmount", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Max Amount */}
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "4px", 
            fontSize: "14px", 
            fontWeight: "500",
            color: "#374151"
          }}>
            Max Amount
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="$999.99"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Search Text */}
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "4px", 
            fontSize: "14px", 
            fontWeight: "500",
            color: "#374151"
          }}>
            Search Description
          </label>
          <input
            type="text"
            placeholder="Search in descriptions..."
            value={filters.searchText}
            onChange={(e) => handleFilterChange("searchText", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "14px"
            }}
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div style={{ 
          marginTop: "15px", 
          padding: "10px", 
          backgroundColor: "#dbeafe", 
          borderRadius: "4px",
          fontSize: "14px",
          color: "#1e40af"
        }}>
          <strong>Active filters:</strong>
          {filters.category && ` Category: ${filters.category} •`}
          {filters.dateFrom && ` From: ${filters.dateFrom} •`}
          {filters.dateTo && ` To: ${filters.dateTo} •`}
          {filters.minAmount && ` Min: $${filters.minAmount} •`}
          {filters.maxAmount && ` Max: $${filters.maxAmount} •`}
          {filters.searchText && ` Search: "${filters.searchText}" •`}
        </div>
      )}
    </div>
  );
}

export default FilterBar;