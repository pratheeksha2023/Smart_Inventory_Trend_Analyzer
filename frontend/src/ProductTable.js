import React from 'react';
import axios from 'axios';

function ProductTable({
  products,
  refreshProducts,
  adminMode
}) {


  const deleteProduct = async (id) => {

    const confirmDelete = window.confirm(
      'Delete this product?'
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(
        `http://127.0.0.1:5000/products/${id}`
      );

      alert('Product removed successfully');

      refreshProducts();

    } catch {

      alert('Error deleting product');
    }
  };


  const editProduct = async (product) => {

    const updatedName = prompt(
      'Enter new product name',
      product.name
    );

    const updatedCategory = prompt(
      'Enter new category',
      product.category
    );

    const updatedQuantity = prompt(
      'Enter new quantity',
      product.quantity
    );

    const updatedPrice = prompt(
      'Enter new price',
      product.price
    );


    if (
      !updatedName ||
      updatedQuantity < 0 ||
      updatedPrice < 0
    ) {

      alert('Invalid input');

      return;
    }


    try {

      await axios.put(
        `http://127.0.0.1:5000/products/${product.id}`,
        {
          name: updatedName,
          category: updatedCategory,
          quantity: updatedQuantity,
          price: updatedPrice
        }
      );

      alert('Product updated successfully');

      refreshProducts();

    } catch {

      alert('Error updating product');
    }
  };


  const getStatus = (quantity) => {

    if (quantity < 5) {
      return 'Low';
    }

    if (quantity <= 15) {
      return 'Medium';
    }

    return 'Good';
  };


  return (

    <div>

      <h2>Inventory Products</h2>

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Value</th>
            <th>Status</th>

            {
              adminMode && (
                <th>Actions</th>
              )
            }

          </tr>

        </thead>


        <tbody>

          {
            products.map((product) => (

              <tr
                key={product.id}
                className={
                  product.quantity < 5
                    ? 'low-stock-row'
                    : ''
                }
              >

                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>₹{product.price}</td>

                <td>
                  ₹{
                    product.quantity *
                    product.price
                  }
                </td>

                <td>

                  <span
                    className={`status ${
                      getStatus(product.quantity)
                    }`}
                  >
                    {getStatus(product.quantity)}
                  </span>

                </td>


                {
                  adminMode && (

                    <td>

                      <button
                        onClick={() =>
                          editProduct(product)
                        }
                      >
                        Edit
                      </button>


                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteProduct(product.id)
                        }
                      >
                        Delete
                      </button>

                    </td>
                  )
                }

              </tr>

            ))
          }

        </tbody>

      </table>

    </div>
  );
}

export default ProductTable;