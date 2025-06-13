import React from "react";

function SimpleAnalyticsTest({ expenses, showCharts, setShowCharts }) {
  console.log('SimpleAnalyticsTest rendered with showCharts:', showCharts);

  return (
    <div style={{ border: '2px solid purple', padding: '20px' }}>
      <h2>🧪 SIMPLE TEST COMPONENT</h2>
      
      <button
        onClick={() => {
          console.log('TEST: Button clicked, showCharts was:', showCharts);
          setShowCharts(!showCharts);
          console.log('TEST: Set showCharts to:', !showCharts);
        }}
        style={{
          backgroundColor: showCharts ? "#ef4444" : "#10b981",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "20px"
        }}
      >
        {showCharts ? "Hide Charts" : "Show Charts"}
      </button>

      <div style={{ 
        fontSize: '18px', 
        fontWeight: 'bold',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: showCharts ? '#ffe6e6' : '#e6f2ff'
      }}>
        Current State: showCharts = {showCharts.toString()}
      </div>

      {showCharts ? (
        <div style={{
          border: '3px solid red',
          padding: '20px',
          backgroundColor: '#ffe6e6',
          borderRadius: '8px'
        }}>
          <h3>🔴 CHARTS ARE VISIBLE</h3>
          <p>You should see this when showCharts = true</p>
          <p>Expenses count: {expenses.length}</p>
        </div>
      ) : (
        <div style={{
          border: '3px solid blue',
          padding: '20px',
          backgroundColor: '#e6f2ff',
          borderRadius: '8px'
        }}>
          <h3>🔵 SIMPLE VIEW IS VISIBLE</h3>
          <p>You should see this when showCharts = false</p>
          <p>Expenses count: {expenses.length}</p>
        </div>
      )}
    </div>
  );
}

export default SimpleAnalyticsTest;