import React from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

function Dashboard({ analytics }) {

  if (!analytics) {
    return <p>Loading analytics...</p>;
  }

  if (analytics.message) {

    return (
      <div>
        <h2>Dashboard</h2>
        <p>{analytics.message}</p>
      </div>
    );
  }


  // Convert category object to array
  const chartData = Object.entries(
    analytics.category_counts
  ).map(([category, quantity]) => ({
    category,
    quantity
  }));


  const COLORS = [
    '#4f46e5',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#06b6d4'
  ];


  return (

    <div>

      <h2>
        Inventory Analytics Dashboard
      </h2>


      {/* DASHBOARD CARDS */}

      <div className="dashboard-box">

        <div className="stat-box">
          <h3>Total Products</h3>
          <p>{analytics.total_products}</p>
        </div>


        <div className="stat-box">
          <h3>Total Stock</h3>
          <p>{analytics.total_stock}</p>
        </div>


        <div className="stat-box">
          <h3>Total Inventory Value</h3>
          <p>₹{analytics.total_value}</p>
        </div>

      </div>


      {/* CHART SECTION */}

      <div className="chart-container">

        {/* BAR CHART */}

        <div className="chart-card">

          <h3>Inventory by Category</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart data={chartData}>

              <XAxis dataKey="category" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="quantity"
                fill="#4f46e5"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* PIE CHART */}

        <div className="chart-card">

          <h3>Category Distribution</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={chartData}
                dataKey="quantity"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >

                {
                  chartData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />

                    )
                  )
                }

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;