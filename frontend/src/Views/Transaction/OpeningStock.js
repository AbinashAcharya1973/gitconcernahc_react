import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const OpeningStock = () => {
  const [staffs, setStaffs] = useState([]);
  const [formData, setFormData] = useState({
    stock_point_holder: 0,
    product_name: '',
    quantity: '', // This will hold the input value from the form
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList, setProductList] = useState([]);

  // Fetch staff data
  useEffect(() => {
    fetch('http://localhost:80/api/staffs')
      .then((response) => response.json())
      .then((data) => {
        setStaffs(data);
        if (data.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            stock_point_holder: data[0].id,
          }));
          fetchStockForHolder(data[0].id); // Fetch stock for the first staff member
        }
      })
      .catch((error) => console.error('Error fetching staff:', error));
  }, []);

  // Fetch product data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:80/api/products');
        const data = await response.json();
        setProductList(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If the stock point holder changes, fetch stock for the selected holder
    if (name === 'stock_point_holder') {
      fetchStockForHolder(value);
    }
  };

  // Fetch stock for the selected stock point holder
  async function fetchStockForHolder(stockHolderId) {
    try {
        const response = await fetch(`http://localhost:80/api/getStaff/${stockHolderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSelectedProducts(data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching stock:', error);
    }
}

// Call the function with the appropriate stock_holder_id
 // Replace with the actual ID


  // Handle adding product to the stock list and sending to the server
  const handleAddToStock = async () => {
    const quantity = parseInt(formData.quantity); // Get quantity from formData
  
    if (formData.product_name && quantity > 0 && formData.stock_point_holder) {
      const selectedProduct = productList.find(product => product.product_name === formData.product_name);
      const selectedStaff = staffs.find(staff => staff.id == formData.stock_point_holder);
  
      const dataToSend = {
        product_name: selectedProduct ? selectedProduct.product_name : '',
        product_id: selectedProduct ? selectedProduct.id : '',
        quantity: quantity, // Use parsed quantity
        stock_point_holder: formData.stock_point_holder,
        staff_code: selectedStaff ? selectedStaff.code : '',
      };
  
      try {
        const response = await fetch('http://localhost:80/api/updateopstock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Product added successfully:', data);
  
        // Update the selected products list
        setSelectedProducts((prevSelectedProducts) => {
          const existingProductIndex = prevSelectedProducts.findIndex(product => product.product_name === formData.product_name);
  
          if (existingProductIndex >= 0) {
            // Product already exists, replace its quantity
            const updatedProducts = [...prevSelectedProducts];
            updatedProducts[existingProductIndex].opqty = quantity.toString(); // Set to the new quantity
            return updatedProducts;
          } else {
            // Add new product
            return [
              ...prevSelectedProducts,
              {
                product_name: formData.product_name,
                opqty: quantity.toString(), // Add as new entry
              },
            ];
          }
        });
  
        // Clear the form fields
        setFormData({
          ...formData,
          product_name: '',
          quantity: '',
        });
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }
  };
      
  return (
    <div className="container mt-5">
      <h2>Opening Stock Form</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="stock_point_holder" className="form-label">Stock Point/Holder</label>
          <select
            className="form-select"
            id="stock_point_holder"
            name="stock_point_holder"
            value={formData.stock_point_holder}
            onChange={handleInputChange}
            required
          >
            {staffs.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.fullname} ({staff.designation})
              </option>
            ))}
          </select>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="product_name" className="form-label">Product Name</label>
            <select
              className="form-select"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a product</option>
              {productList.map((product) => (
                <option key={product.id} value={product.product_name}>
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="text"
              className="form-control"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              
            />
          </div>

          <div className="col d-flex align-items-end">
            <button type="button" className="btn btn-primary" onClick={handleAddToStock}>
              Update Op.Stock
            </button>
          </div>
        </div>
      </form>

      <h3>Product List</h3>
      {selectedProducts.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Opening Qty</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.product_name}</td>
                <td>{product.opqty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products added yet.</p>
      )}
    </div>
  );
};

export default OpeningStock;
