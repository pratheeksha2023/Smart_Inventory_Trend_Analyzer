import React, { useState } from 'react';
import axios from 'axios';

function ProductForm({ refreshProducts }) {

  const [product, setProduct] = useState({
    name: '',
    category: '',
    quantity: '',
    price: ''
  });


  const handleChange = (e) => {

    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    // VALIDATION

    if (
      !product.name.trim() ||
      !product.category.trim()
    ) {

      alert(
        "Name and Category cannot be empty"
      );

      return;
    }


    if (
      product.quantity < 0 ||
      product.price < 0
    ) {

      alert(
        "Negative values are not allowed"
      );

      return;
    }


    try {

      await axios.post(
        'http://127.0.0.1:5000/products',
        product
      );

      alert(
        "Product added successfully"
      );

      setProduct({
        name: '',
        category: '',
        quantity: '',
        price: ''
      });

      refreshProducts();

    } catch (error) {

      alert(
        "Error adding product"
      );
    }
  };


  return (

    <div>

      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />


        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          required
        />


        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          required
        />


        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />


        <button type="submit">
          Add Product
        </button>

      </form>

    </div>
  );
}

export default ProductForm;