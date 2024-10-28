import React, { useState, useEffect,useContext } from 'react';
import { Button, Form, Accordion, Table } from 'react-bootstrap';


const AddVisit = ({onClose,id}) => {

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    visitedTo: '',
    couponCollectionList: [],
    couponSettlementList: [],
    SampleGivenList: [],
    GiftList:[],
  });

  const [doctors, setDoctors] = useState([]);
  const [products, setProducts] = useState([]); // New state for products

  const [couponCollection, setCouponCollection] = useState({
    product_name: '',
    qty: 0,
    points: 0,
    bonous: 0
  });
  const [PointSummary, setPointSummary] = useState({
    OpeningPoints: 0,
    CollectedPoints: 0,
    SettledPoints: 0,
    ClosingPoints:0
  });
//Total Cupon Collection
  const [total, setTotal] = useState({
    totalQty: 0,
    totalPoints: 0,
    totalBonus: 0
  });

  const [couponSettlement,setCouponSettlement] = useState({
    product_name:'',
    qty:0,
    points:0
    // bonous:0
  })

  const [totalSettlement, setTotalSettlement] = useState({
    totalQty1: 0,
    totalPoints1: 0,
    // totalBonus1: 0
  });
  const [productSample,setProductSample] = useState({
    product_name:'',
    qty:0,
    points:0
    // bonous:0
  })
  const [totalSample, setTotalSample] = useState({
    totalQty2: 0,
    totalPoints2: 0,
    // totalBonus1: 0
  });
  const [Gift,setGift] = useState({
    product_name:'',
    qty:0,    
    // bonous:0
  })
  const [totalGift, setTotalGift] = useState({
    totalQty: 0, 
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:80/api/clients");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:80/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data); // Set the fetched products data
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchDoctors();
    fetchProducts(); // Fetch products on component mount
  }, []);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCouponCollectionChange = (e) => {
    const { name, value } = e.target;

    if (name === 'productName') {
      // Fetch bonus and special bonus points when the product is selected
      const selectedProduct = products.find(product => product.id == value);
      if (selectedProduct) {
        setCouponCollection(prevCoupon => ({
          ...prevCoupon,
          product_name: selectedProduct.product_name, // Keep product ID as `productName`
          points: selectedProduct.points,
          bonous: selectedProduct.bonous
        }));
      }
    } else {
      setCouponCollection({
        ...couponCollection,
        [name]: value
      });
    }
  };

  const handleCouponSettlmentChange = (e) => {
    const { name, value } = e.target;

    if (name === 'productName') {
      // Fetch bonus and special bonus points when the product is selected
      const selectedProduct = products.find(product => product.id == value);
      if (selectedProduct) {
        setCouponSettlement(prevCoupon => ({
          ...prevCoupon,
          product_name: selectedProduct.product_name, // Keep product ID as `productName`
          points: selectedProduct.points_on_settlement,
          // bonous: selectedProduct.bonous
        }));
      }
    } else {
      setCouponSettlement({
        ...couponSettlement,
        [name]: value
      });
    }
  };
  const handleProductSampleGivenChange = (e) => {
    const { name, value } = e.target;
    if(name === 'productName'){
      const selectedProduct = products.find(product => product.id == value);
      if (selectedProduct) {
        setProductSample(prevCoupon => ({
          ...prevCoupon,
          product_name: selectedProduct.product_name, // Keep product ID as `productName`
          points: selectedProduct.points
          //bonous: selectedProduct.bonous
        }));
      }
    }else{
      setProductSample({
        ...productSample,
        [name]: value
      });
    }
  };
  const handleQtyChange = (e) => {
    const qty = e.target.value;
    setCouponCollection(prevCoupon => ({
      ...prevCoupon,
      // product_name:couponCollection.product_name,
      qty: qty,
      points: qty * couponCollection.points, // Multiply the quantity by the bonus point
      bonous: qty * couponCollection.bonous 
    }));    
    
  };
  
  const handleSQtyChange = (e) => {
    const qty = e.target.value;
   
    setCouponSettlement(prevCoupon => ({
      ...prevCoupon,
      // product_name:couponCollection.product_name,
      qty: qty,
      points: qty * couponSettlement.points, // Multiply the quantity by the bonus point
      //bonous: qty * couponSettlement.bonous 
    }));
  };

  const handleSampleQtyChange = (e) => {
    const qty = e.target.value;
    setProductSample(prevCoupon => ({
      ...prevCoupon,
      // product_name:couponCollection.product_name,
      qty: qty,
      points: qty * productSample.points, // Multiply the quantity by the bonus point
      //bonous: qty * couponSettlement.bonous
    }));
  };
  const handleGiftChange = (e) => {
    const { name, value } = e.target;
    if(name === 'productName'){
      const selectedProduct = products.find(product => product.id == value);
      if (selectedProduct) {
        setGift(prevCoupon => ({
          ...prevCoupon,
          product_name: selectedProduct.product_name, // Keep product ID as `productName`          
          //bonous: selectedProduct.bonous
        }));
      }
    }else{
      setGift({
        ...Gift,
        [name]: value
      });
    }
  }
  const handleGiftQtyChange = (e) => {
    const qty = e.target.value;
    setGift(prevCoupon => ({
      ...prevCoupon,
      // product_name:couponCollection.product_name,
      qty: qty,            
    }));
  };
  const handleAddCouponCollection = () => {
    setFormData({
      ...formData,
      couponCollectionList: [...formData.couponCollectionList, couponCollection],
    });

    // Update the total sums
    setTotal({
      totalQty: total.totalQty + parseInt(couponCollection.qty),
      totalPoints: total.totalPoints + parseInt(couponCollection.points),
      totalBonus: total.totalBonus + parseInt(couponCollection.bonous)
    });
    setPointSummary({
      CollectedPoints: PointSummary.CollectedPoints + parseInt(couponCollection.points),
      ClosingPoints: PointSummary.CollectedPoints - PointSummary.SettledPoints,
    });

    setCouponCollection({ product_name: '', qty: 0, points: 0, bonous: 0 });
  };

  const handleAddCouponSettlement = () => {
    setFormData({
      ...formData,
      couponSettlementList: [...formData.couponSettlementList, couponSettlement],
    });

    // Update the total sums
    setTotalSettlement({
      totalQty1: totalSettlement.totalQty1 + parseInt(couponSettlement.qty),
      totalPoints1: totalSettlement.totalPoints1 + parseInt(couponSettlement.points),
      // totalBonus1: totalSettlement.totalBonus1 + parseInt(couponSettlement.bonous)
    });
    setPointSummary({
      SettledPoints: PointSummary.SettledPoints + parseInt(couponSettlement.points),
      ClosingPoints: PointSummary.CollectedPoints - PointSummary.SettledPoints,
    });
    setCouponSettlement({ product_name: '', qty: '', points: 0 });
  };
  const handleAddProductSampleGiven=()=>{
    setFormData({
      ...formData,
      SampleGivenList: [...formData.SampleGivenList, productSample],
    });
    setTotalSample({
      totalQty2: totalSample.totalQty2 + parseInt(productSample.qty),
      totalPoints2: totalSample.totalPoints2 + parseInt(productSample.points),
      // totalBonus2: totalSampleGiven.totalBonus2 + parseInt(productSample.bonous)
    });

  };
  const handleAddGift = () => {
    setFormData({
      ...formData,
      GiftList: [...formData.GiftList, Gift],
    });
    setTotalGift({
      totalQty: totalGift.totalQty + parseInt(Gift.qty),      
      // totalBonus3: totalGift.totalBonus3 + parseInt(gift.bonous)
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDoctor = doctors.find(doctor => doctor.client_id == formData.visitedTo);
    const CompleteVisitPayload={
      // Construct the payload for visit details
      visitHeadPayload:{
        date: formData.date,
        time: formData.time,
        visitedTo: formData.visitedTo,
        visitedToFullName: selectedDoctor ? selectedDoctor.client_name : "",  // Send full name of doctor
        totalQty: total.totalQty,
        totalPoints: total.totalPoints,
        totalBonus: total.totalBonus,
        totalSettlementQty: totalSettlement.totalQty1,
        totalSettlementPoints: totalSettlement.totalPoints1,
        totalSampleQty: totalSample.totalQty2,
        totalSamplePoints:totalSample.totalPoints2,
        totalGiftQty: totalGift.totalQty,
        staff_id:id      
      },
      couponPayload:formData.couponCollectionList.map( (coupon) => {
        const selectedProduct = products.find(product => product.product_name === coupon.product_name);
        return{
          product_name: selectedProduct ? selectedProduct.product_name : coupon.product_name,  // Get product name
          product_id: selectedProduct ? selectedProduct.id : null,  // Get product id
          qty: coupon.qty,
          points: coupon.points,
          bonus: coupon.bonous,
          transaction_group:'coupon_collected'
        };
      } ),
      settlementPayload:formData.couponSettlementList.map((coupon) => {
        const selectedProduct = products.find(product => product.product_name === coupon.product_name);
        return{
          product_name: selectedProduct ? selectedProduct.product_name : coupon.product_name,  // Get product name
          product_id: selectedProduct ? selectedProduct.id : null,  // Get product id
          qty: coupon.qty,
          points: coupon.points,
          // bonus: coupon.bonous,
          transaction_group:'coupon_settlement'
        };
      }),
      sampleGivenPayload:formData.SampleGivenList.map((sample) => {
        const selectedProduct = products.find(product => product.product_name === sample.product_name);
        return{
          product_name: selectedProduct ? selectedProduct.product_name : sample.product_name,  // Get product name
          product_id: selectedProduct ? selectedProduct.id : null,  // Get product id
          qty: sample.qty,
          points: sample.points,
          // bonus: coupon.bonous,
          transaction_group:'sample_given'
        };
      }),
      giftPayload:formData.GiftList.map((gift)=>{
        const selectedProduct = products.find(product => product.product_name === gift.product_name);
        return{
          product_name: selectedProduct ? selectedProduct.product_name : gift.product_name,  // Get product name
          product_id: selectedProduct ? selectedProduct.id : null,  // Get product id
          qty: gift.qty,                    
          transaction_group:'gift'
        };
      }),
      
    }
    try {
        // Send visit head data to the backend
        const visitHeadResponse = await fetch('http://localhost:80/api/addvisithead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(CompleteVisitPayload), // Send the payload as JSON
        });

        if (!visitHeadResponse.ok) {
            throw new Error('Failed to save visit head details');
        }      
        // If all requests are successful, show success message
        alert('Visit and coupon details saved successfully');
        // Optionally reset the form or perform additional actions
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save the visit details. Please try again.');
    }
};


  return (
    <div className="container my-4">
      <h3>Add Visit</h3>
      <Form >
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={formData.time}
            onChange={handleFormChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Visited To</Form.Label>
          <Form.Control
            as="select"
            name="visitedTo"
            value={formData.visitedTo}
            onChange={handleFormChange}
            required
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.client_id} value={doctor.client_id}>
                {doctor.client_name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Accordion defaultActiveKey="0" className="mb-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="bg-primary text-white">
              <div class="text-primary"><strong>COUPON COLLECTION</strong></div>
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  as="select"
                  name="productName"
                  value={couponCollection.product_name}
                  onChange={handleCouponCollectionChange}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Qty</Form.Label>
                <Form.Control
                  type="text"
                  name="qty"
                  value={couponCollection.qty}
                  onChange={handleQtyChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="text"
                  name="bonusQty"
                  value={couponCollection.points}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Bonus Points</Form.Label>
                <Form.Control
                  type="text"
                  name="specialBonusQty"
                  value={couponCollection.bonous}
                  readOnly
                />
              </Form.Group>

              <Button variant="success" onClick={handleAddCouponCollection}>
                Add List
              </Button>

              {formData.couponCollectionList.length > 0 && (
                <Table striped bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Qty</th>
                      <th>Points</th>
                      <th>Bonus Pt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.couponCollectionList.map((item, index) => (
                      <tr key={index}>
                        <td>{products.find(p => p.product_name == item.product_name)?.product_name || ''}</td>
                        <td>{item.qty}</td>
                        <td>{item.points}</td>
                        <td>{item.bonous}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Accordion.Body>

            <div class="text-primary" style={{ backgroundColor: '#f8f9fa', padding: '10px', marginTop: '10px'}}>
              <div className="row" style={{ marginLeft: '25px' }}>
                <div className="col"><strong>Total</strong></div>
                <div className="col"><strong>Qty: {total.totalQty}</strong></div>
                <div className="col"><strong>Points: {total.totalPoints}</strong></div>
                <div className="col"><strong>Bonus: {total.totalBonus}</strong></div>
              </div>
            </div>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header className="bg-primary text-white">
              <div class="text-success"><strong>COUPON SETTLEMENT</strong></div>
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  as="select"
                  name="productName"
                  value={couponSettlement.product_name}
                  onChange={handleCouponSettlmentChange}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Qty</Form.Label>
                <Form.Control
                  type="text"
                  name="qty"
                  value={couponSettlement.qty}
                  onChange={handleSQtyChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="text"
                  name="bonusQty"
                  value={couponSettlement.points}
                  readOnly
                />
              </Form.Group>

              {/* <Form.Group className="mb-3">
                <Form.Label>Bonus Points</Form.Label>
                <Form.Control
                  type="text"
                  name="specialBonusQty"
                  value={couponSettlement.bonous}
                  readOnly
                />
              </Form.Group> */}

              <Button variant="success" onClick={handleAddCouponSettlement}>
                Add List
              </Button>

              {formData.couponSettlementList.length > 0 && (
                <Table striped bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Qty</th>
                      <th>Points</th>
                      {/* <th>Bonus Pt</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.couponSettlementList.map((item, index) => (
                      <tr key={index}>
                        <td>{products.find(p => p.product_name == item.product_name)?.product_name || ''}</td>
                        <td>{item.qty}</td>
                        <td>{item.points}</td>
                        {/* <td>{item.bonous}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Accordion.Body>

            <div class="text-success" style={{ backgroundColor: '#f8f9fa', padding: '10px', marginTop: '10px'}}>
              <div className="row" style={{ marginLeft: '25px' }}>
                <div className="col"><strong>Total</strong></div>
                <div className="col"><strong>Qty: {totalSettlement.totalQty1}</strong></div>
                <div className="col"><strong>Points: {totalSettlement.totalPoints1}</strong></div>
                {/* <div className="col"><strong>Bonus: {totalSettlement.totalBonus1}</strong></div> */}
              </div>
              <hr/>
              <div className="row" style={{ marginBottom: '25px', marginLeft: '25px' }}>
                <div className="col-md-6 text-primary"><strong>Opening Points:{PointSummary.OpeningPoints}</strong></div>
                <div className="col-md-6 text-warning"><strong>Collected Points:{PointSummary.CollectedPoints}</strong></div>
                <div className="col-md-6 text-success"><strong>Settled Points:{PointSummary.SettledPoints}</strong></div>
                <div className="col-md-6 text-danger"><strong>Closing Points:{PointSummary.ClosingPoints}</strong></div>
              </div>
            </div>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header className="bg-primary text-white">
              <div class="text-warning"><strong>SAMPLE</strong></div>
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  as="select"
                  name="productName"
                  value={productSample.product_name}
                  onChange={handleProductSampleGivenChange}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Qty</Form.Label>
                <Form.Control
                  type="text"
                  name="qty"
                  value={productSample.qty}
                  onChange={handleSampleQtyChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="text"
                  name="bonusQty"
                  value={productSample.points}
                  readOnly
                />
              </Form.Group>

              {/* <Form.Group className="mb-3">
                <Form.Label>Bonus Points</Form.Label>
                <Form.Control
                  type="text"
                  name="specialBonusQty"
                  value={couponSettlement.bonous}
                  readOnly
                />
              </Form.Group> */}

              <Button variant="success" onClick={handleAddProductSampleGiven}>
                Add List
              </Button>

              {formData.SampleGivenList.length > 0 && (
                <Table striped bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Qty</th>
                      <th>Points</th>
                      {/* <th>Bonus Pt</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.SampleGivenList.map((item, index) => (
                      <tr key={index}>
                        <td>{products.find(p => p.product_name == item.product_name)?.product_name || ''}</td>
                        <td>{item.qty}</td>
                        <td>{item.points}</td>
                        {/* <td>{item.bonous}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Accordion.Body>

            <div class="text-warning" style={{ backgroundColor: '#f8f9fa', padding: '10px', marginTop: '10px' }}>
              <div className="row" style={{ marginLeft: '25px' }}>
                <div className="col"><strong>Total</strong></div>
                <div className="col"><strong>Qty: {totalSample.totalQty2}</strong></div>
                <div className="col"><strong>Points: {totalSample.totalPoints2}</strong></div>
                {/* <div className="col"><strong>Bonus: {totalSettlement.totalBonus1}</strong></div> */}
              </div>
            </div>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header className="bg-primary text-white">
              <div class="text-danger"><strong>GIFT</strong></div>
            </Accordion.Header>
            <Accordion.Body>
            <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  as="select"
                  name="productName"
                  value={Gift.product_name}
                  onChange={handleGiftChange}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Qty</Form.Label>
                <Form.Control
                  type="text"
                  name="qty"
                  value={Gift.qty}
                  onChange={handleGiftQtyChange}
                />
              </Form.Group>
              <Button variant="success" onClick={handleAddGift}>
                Add List
              </Button>
              {formData.GiftList.length > 0 && (
                <Table striped bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Qty</th>                                            
                    </tr>
                  </thead>
                  <tbody>
                    {formData.GiftList.map((item, index) => (
                      <tr key={index}>
                        <td>{products.find(p => p.product_name == item.product_name)?.product_name || ''}</td>
                        <td>{item.qty}</td>                                                
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}              
            </Accordion.Body>
            <div class="text-danger" style={{ backgroundColor: '#f8f9fa', padding: '10px', marginTop: '10px' }}>
              <div className="row" style={{ marginLeft: '25px' }}>
                <div className="col"><strong>Total</strong></div>
                <div className="col"><strong>Qty: {totalGift.totalQty}</strong></div>                                
              </div>
            </div>
          </Accordion.Item>
        </Accordion>
        
        <Button variant="primary" onClick={handleSubmit}>
          Save Visit
        </Button>
        <Button variant="secondary" className="ms-2" onClick={onClose}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default AddVisit;
