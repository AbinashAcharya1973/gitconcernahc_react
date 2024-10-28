import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Stock_Issue = () => {
  const [challanData, setChallanData] = useState({
    challan_date: '',
    issued_to: 0,
    total_quantity: ''
  });

  const [staffList, setStaffList] = useState([]); // For storing staff list for dropdown
  const [productList, setProductList] = useState([]); // For storing the list of products from API
  const [productData, setProductData] = useState({
    product_id:0,
    product_name: '',
    product_type:'',
    quantity: ''
  });

  const [selectedProducts, setSelectedProducts] = useState([]); // For products added to the challan

  // Fetch the staff list from the API to populate the select dropdown
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await fetch('http://localhost:80/api/staffs');
        const data = await response.json();
        setStaffList(data);
      } catch (error) {
        console.error('Error fetching staffs:', error);
      }
    };
    fetchStaffs();
  }, []);

  // Fetch the product list from the API to populate the product select dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:80/api/products'); // Adjust your API endpoint
        const data = await response.json();
        setProductList(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleChallanChange = (e) => {
    const { name, value } = e.target;
    setChallanData({ ...challanData, [name]: value });
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'product_name') {
      const selectedProduct = productList.find(product => product.product_name === value);
      setProductData({
        product_id: selectedProduct.id, // Assuming the API response includes the product ID
        product_type: selectedProduct.product_type, // Assuming the API includes the product type
        product_name: selectedProduct.product_name,
        quantity: productData.quantity
      });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };
  

  const handleAddProduct = () => {
    if (productData.product_name && productData.quantity) {
      setSelectedProducts([...selectedProducts, productData]);
      setProductData({ product_name: '', quantity: '' });
    } else {
      alert('Please enter both product name and quantity.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalQuantity = selectedProducts.reduce((total, product) => {
      return total + parseInt(product.quantity, 10);
    }, 0);

    const selectedStaff = staffList.find((staff) => 
      staff.id == challanData.issued_to
    );

    if (!selectedStaff) {
      alert("Please select a valid staff member.");
      return;
    }

    const receivedBy = selectedStaff.fullname;
    const receiverCode = selectedStaff.code;
    const stockHolderId = selectedStaff.id;

    const challanWithoutProducts = {
      challan_date: challanData.challan_date,
      issued_to: challanData.issued_to, // Send the ID of the selected staff member
      received_by: receivedBy,
      receiver_code: receiverCode,
      total_quantity: totalQuantity // Set total quantity from product list
    };

    try {
      // First API call to /outwardchallan
      const challanResponse = await fetch('http://localhost:80/api/outwardchallan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challanWithoutProducts)
      });

      const challanDataResponse = await challanResponse.json();

      if (challanResponse.ok) {
        // Now send the product details to /outwardchallan_details
        const challanId = challanDataResponse.id; // Assume the ID is returned from the first call

        const productDetails = {
          stock_holder_id: stockHolderId, // Reference to the main challan
          products: selectedProducts
        };

        const productResponse = await fetch('http://localhost:80/api/outwardchallan_details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productDetails)
        });

        const productDataResponse = await productResponse.json();

        if (productResponse.ok) {
          alert('Challan and product details added successfully!');
          setChallanData({
            challan_date: '',
            issued_to: '',
            total_quantity: ''
          });
          setSelectedProducts([]);
        } else {
          alert('Error saving product details: ' + productDataResponse.error);
        }
      } else {
        alert('Error saving challan: ' + challanDataResponse.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  // Calculate the total quantity from the selected products
  const totalQuantity = selectedProducts.reduce((total, product) => {
    return total + parseInt(product.quantity, 10);
  }, 0);

  // Set total_quantity value dynamically
  useEffect(() => {
    setChallanData((prevState) => ({
      ...prevState,
      total_quantity: totalQuantity
    }));
  }, [totalQuantity]);

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <h2 className="mb-4">Stock Issue</h2>
        <div className="mb-3">
          <label className="form-label">Issue Date:</label>
          <input
            type="date"
            className="form-control"
            name="challan_date"
            value={challanData.challan_date}
            onChange={handleChallanChange}
           
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Issued To:</label>
          <select
            className="form-select"
            name="issued_to"
            value={challanData.issued_to}
            onChange={handleChallanChange}
            
          >
            <option value="">Select (VSO/Manager)</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.fullname}
              </option>
            ))}
          </select>
        </div>

        <h3 className="mb-3">Product Entry</h3>
        <div className="row g-3 align-items-center mb-3">
          <div className="col-md-5">
            <label className="form-label">Product Name:</label>
            <select
              className="form-select"
              name="product_name"
              value={productData.product_name}
              onChange={handleProductChange}
             
            >
              <option value="">Select Product</option>
              {productList.map((product) => (
                <option key={product.id} value={product.product_name}>
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Quantity:</label>
            <input
              type="text"
              className="form-control"
              name="quantity"
              value={productData.quantity}
              onChange={handleProductChange}
              
            />
          </div>
          <div className="col-md-auto">
            <button type="button" className="btn btn-primary mt-3" onClick={handleAddProduct}>
              Add to List
            </button>
          </div>
        </div>

        <h3 className="mb-3">Product List</h3>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th scope="col">Product Name</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.length > 0 ? (
              <>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.product_name}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
                {/* New row for total quantity */}
                <tr>
                  <td><strong>Total Quantity</strong></td>
                  <td><strong>{totalQuantity}</strong></td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="2" className="text-center">No products added yet.</td>
              </tr>
            )}
          </tbody>
        </table>

        <button type="submit" className="btn btn-success mt-3">
          Save Challan
        </button>
      </form>
    </div>
  );
};

export default Stock_Issue;
