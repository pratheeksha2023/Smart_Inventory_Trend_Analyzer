import React, {
  useEffect,
  useState
} from 'react';

import axios from 'axios';
import './App.css';

import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import Dashboard from './Dashboard';

function App() {

  const [products, setProducts] = useState([]);

  const [analytics, setAnalytics] = useState(null);

  const [search, setSearch] = useState('');

  const [categoryFilter, setCategoryFilter] =
  useState('');

  const [adminMode, setAdminMode] = useState(false);


  const fetchProducts = async () => {

    const response = await axios.get(
      'http://127.0.0.1:5000/products'
    );

    setProducts(response.data);
  };


  const fetchAnalytics = async () => {

    const response = await axios.get(
      'http://127.0.0.1:5000/analytics'
    );

    setAnalytics(response.data);
  };


  const refreshProducts = () => {

    fetchProducts();
    fetchAnalytics();
  };


  useEffect(() => {

    refreshProducts();

  }, []);


  const filteredProducts = products.filter(
  (product) => {

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesCategory =
      categoryFilter === '' ||
      product.category === categoryFilter;

    return (
      matchesSearch &&
      matchesCategory
    );
  }
);


  const enableAdmin = () => {

    const password = prompt(
      'Enter Admin Password'
    );

    if (password === 'admin123') {

      alert('Admin Access Enabled');

      setAdminMode(true);

    } else {

      alert('Incorrect Password');
    }
  };


  return (

  <div
    className={
      adminMode
        ? 'app-layout light-mode'
        : 'app-layout dark-mode'
    }
  >

    {/* SIDEBAR */}

    <div className="sidebar">

      <h2 className="logo">
        StockWise
      </h2>

      <ul>

        <li>📊 Dashboard</li>

        <li>📦 Inventory</li>

        <li>📈 Analytics</li>

        <li>⚠ Low Stock</li>

        <li>📋 Reports</li>

      </ul>

    </div>


    {/* MAIN CONTENT */}

    <div className="main-content">

      <div className="topbar">

        <h1>
          Smart Inventory Trend Analyzer
        </h1>


        {
          !adminMode ? (

            <button
              className="admin-btn"
              onClick={enableAdmin}
            >
              ☀ Switch to Admin Mode
            </button>

          ) : (

            <button
              className="admin-btn"
              onClick={() => {

                setAdminMode(false);

                alert(
                  "Returned to User Mode"
                );

              }}
            >
              🌙 Return to User Mode
            </button>

          )
        }

      </div>


      <div className="card">

        <Dashboard analytics={analytics} />

      </div>


      {
        adminMode && (

          <div className="card">

            <ProductForm
              refreshProducts={refreshProducts}
            />

          </div>
        )
      }


      {/* SEARCH + FILTER */}

      <div className="card filter-bar">

        <input
          type="text"
          placeholder="Search Product"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
        >

          <option value="">
            All Categories
          </option>

          {
            [...new Set(
              products.map(
                (p) => p.category
              )
            )].map((category) => (

              <option
                key={category}
                value={category}
              >
                {category}
              </option>

            ))
          }

        </select>

      </div>


      <div className="card">

        <ProductTable
          products={filteredProducts}
          refreshProducts={refreshProducts}
          adminMode={adminMode}
        />

      </div>

    </div>

  </div>
);
}

export default App;