from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import os

app = Flask(__name__)
CORS(app)

DB_NAME = 'inventory.db'

def connect_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# Create table
conn = connect_db()
conn.execute('''
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    quantity INTEGER,
    price REAL
)
''')
conn.commit()
conn.close()

# GET PRODUCTS
@app.route('/products', methods=['GET'])
def get_products():
    conn = connect_db()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    return jsonify([dict(row) for row in products])

# ADD PRODUCT
@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    name = data['name']
    category = data['category']
    quantity = int(data['quantity'])
    price = float(data['price'])
    if quantity < 0 or price < 0:
        return jsonify({'message': 'Invalid values'}), 400
    conn = connect_db()
    conn.execute(
        'INSERT INTO products (name, category, quantity, price) VALUES(?, ?, ?, ?)',
        (name, category, quantity, price)
                )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Product added successfully'})

# UPDATE PRODUCT
@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.json
    conn = connect_db()
    conn.execute(
        'UPDATE products SET name=?, category=?, quantity=?, price=? WHERE id=?',
        (data['name'], data['category'], data['quantity'], data['price'], id)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Product updated'})

# DELETE PRODUCT
@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    conn = connect_db()
    conn.execute('DELETE FROM products WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Product deleted'})

# LOW STOCK ALERT
@app.route('/low-stock', methods=['GET'])
def low_stock():
    conn = connect_db()
    products = conn.execute(
        'SELECT * FROM products WHERE quantity < 5'
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in products])

# ANALYTICS
@app.route('/analytics', methods=['GET'])
def analytics():
    conn = connect_db()
    df = pd.read_sql_query('SELECT * FROM products', conn)
    conn.close()
    if df.empty:
        return jsonify({'message': 'No data available'})
    total_products = len(df)
    total_stock = int(df['quantity'].sum())
    total_value = float((df['quantity'] * df['price']).sum())
    category_counts = df.groupby('category')['quantity'].sum().to_dict()
    return jsonify({
        'total_products': total_products,
        'total_stock': total_stock,
        'total_value': total_value,
        'category_counts': category_counts
})

# GENERATE CHART
@app.route('/chart', methods=['GET'])
def generate_chart():
    conn = connect_db()
    df = pd.read_sql_query('SELECT * FROM products', conn)
    conn.close()
    if df.empty:
        return jsonify({'message': 'No data'})
    category_data = df.groupby('category')['quantity'].sum()
    os.makedirs('charts', exist_ok=True)
    plt.figure(figsize=(6, 4))
    category_data.plot(kind='bar')
    plt.title('Inventory by Category')
    plt.xlabel('Category')
    plt.ylabel('Quantity')
    chart_path = 'charts/inventory_chart.png'
    plt.savefig(chart_path)
    plt.close()
    return jsonify({'message': 'Chart generated successfully'})

if __name__ == '__main__':
    app.run(debug=True)