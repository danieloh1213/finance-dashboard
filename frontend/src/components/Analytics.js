import React, { useEffect } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line,
  Legend
} from 'recharts';

function Analytics({ expenses, showCharts, setShowCharts }) {
  console.log('Analytics rendered with showCharts:', showCharts);

  // Calculate total spending
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate spending by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Sort categories by spending (highest first)
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .map(([category, amount]) => ({ 
      category, 
      amount: parseFloat(amount.toFixed(2)),
      percentage: ((amount / totalSpending) * 100).toFixed(1)
    }));

  // Calculate monthly spending
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthName, amount: 0, expenses: 0 };
    }
    acc[monthKey].amount += expense.amount;
    acc[monthKey].expenses += 1;
    
    return acc;
  }, {});

  // Sort months chronologically (oldest first for line chart)
  const sortedMonths = Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, data]) => ({
      month: data.month,
      amount: parseFloat(data.amount.toFixed(2)),
      expenses: data.expenses
    }));

  // Calculate averages
  const averageExpense = expenses.length > 0 ? totalSpending / expenses.length : 0;
  const averageMonthly = sortedMonths.length > 0 ? totalSpending / sortedMonths.length : 0;

  // Recent spending (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentExpenses = expenses.filter(expense => new Date(expense.date) >= thirtyDaysAgo);
  const recentSpending = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Colors for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'
  ];

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
          <p style={{ margin: 0, color: '#666' }}>
            {formatCurrency(data.value)} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for other charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {entry.name}: {entry.name === 'amount' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px",
        color: "#6b7280",
        backgroundColor: "#f9fafb",
        borderRadius: "8px"
      }}>
        <h3>No expenses to analyze</h3>
        <p>Add some expenses to see your spending analytics!</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px" 
      }}>
        <h2 style={{ margin: 0, color: "#111827" }}>📊 Spending Analytics</h2>
        <button
          onClick={() => {
            console.log('Analytics: Button clicked, showCharts was:', showCharts);
            setShowCharts(!showCharts);
            console.log('Analytics: Set showCharts to:', !showCharts);
          }}
          style={{
            backgroundColor: showCharts ? "#ef4444" : "#10b981",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          {showCharts ? "Hide Charts" : "Show Charts"}
        </button>
      </div>
      
      {/* Summary Cards - Always visible */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginBottom: "30px"
      }}>
        <div style={{
          backgroundColor: "#dbeafe",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#1e40af", fontSize: "14px" }}>TOTAL SPENDING</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1e40af" }}>
            {formatCurrency(totalSpending)}
          </p>
        </div>

        <div style={{
          backgroundColor: "#dcfce7",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#166534", fontSize: "14px" }}>AVERAGE PER EXPENSE</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#166534" }}>
            {formatCurrency(averageExpense)}
          </p>
        </div>

        <div style={{
          backgroundColor: "#fef3c7",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#92400e", fontSize: "14px" }}>LAST 30 DAYS</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#92400e" }}>
            {formatCurrency(recentSpending)}
          </p>
        </div>

        <div style={{
          backgroundColor: "#f3e8ff",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#7c3aed", fontSize: "14px" }}>MONTHLY AVERAGE</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#7c3aed" }}>
            {formatCurrency(averageMonthly)}
          </p>
        </div>
      </div>

      {/* Conditional Content */}
      {showCharts ? (
        <div>
          {/* Pie Chart - Category Distribution */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "15px", color: "#374151" }}>🥧 Category Distribution</h3>
            <div style={{
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              padding: "20px",
              height: "350px"
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                  >
                    {sortedCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - Category Spending */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "15px", color: "#374151" }}>📊 Category Spending</h3>
            <div style={{
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              padding: "20px",
              height: "300px"
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedCategories} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart - Monthly Trends */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "15px", color: "#374151" }}>📈 Monthly Trends</h3>
            <div style={{
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              padding: "20px",
              height: "300px"
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sortedMonths} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="amount"
                    orientation="left"
                    tickFormatter={formatCurrency}
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="count"
                    orientation="right"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    yAxisId="amount"
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="amount"
                  />
                  <Line 
                    yAxisId="count"
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                    name="expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        /* Simple Category List */
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ marginBottom: "15px", color: "#374151" }}>💳 Spending by Category</h3>
          <div style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "20px"
          }}>
            {sortedCategories.map(({ category, amount, percentage }) => (
              <div key={category} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #e5e7eb"
              }}>
                <span style={{ fontWeight: "500", color: "#374151" }}>{category}</span>
                <span style={{ color: "#6b7280" }}>
                  {formatCurrency(amount)} ({percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats - Always visible */}
      <div style={{
        padding: "20px",
        backgroundColor: "#f1f5f9",
        borderRadius: "8px"
      }}>
        <h3 style={{ marginBottom: "15px", color: "#374151" }}>📈 Quick Stats</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          fontSize: "14px"
        }}>
          <div>
            <strong>Total Expenses:</strong> {expenses.length}
          </div>
          <div>
            <strong>Categories Used:</strong> {Object.keys(categoryTotals).length}
          </div>
          <div>
            <strong>Months Tracked:</strong> {sortedMonths.length}
          </div>
          <div>
            <strong>Highest Category:</strong> {sortedCategories[0]?.category || 'None'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;