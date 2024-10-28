// import React, { useEffect, useState } from "react";
// import { Table, Container, Alert } from "react-bootstrap";

// const StockReport = () => {
//   const [stockData, setStockData] = useState([]); // State to hold stock data
//   const [error, setError] = useState(null);       // State to hold error messages
//   const [stockholderIdData, setstockholderIdData] =useState([]);

//   // Function to fetch stock data from backend
//   const fetchStockData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/getstockreport");
//       if (!response.ok) {
//         throw new Error("Error fetching stock data");
//       }
//       const data = await response.json();
//       setStockData(data); // Set the received stock data into state
//     } catch (err) {
//       setError(err.message); // Set error message if request fails
//     }
//   };

//   useEffect(() => {
//     fetchStockData(); // Fetch stock data when the component mounts
//   }, []);

//   // const fetchStockHolderIdData = async () => {
//   //   try {
//   //     const response = await fetch("http://localhost:5000/getstockholderids");
//   //     if (!response.ok) {
//   //       throw new Error("Error fetching stock data");
//   //     }
//   //     const data = await response.json();
//   //     setStockData(data); // Set the received stock data into state
//   //   } catch (err) {
//   //     setError(err.message); // Set error message if request fails
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchStockHolderIdData(); // Fetch stock data when the component mounts
//   // }, []);


//   return (
//     <Container>
//       <h1>Stock Report</h1>
//       {error && <Alert variant="danger">{error}</Alert>} {/* Show error message if any */}
      
//       {/* Table to display stock data */}
//       <Table striped bordered hover className="mt-3">
//         <thead>
//           <tr>
//             <th>Product ID</th>
//             <th>Product Name</th>
//             <th>Product Type</th>
//             <th>Opening Quantity</th>
//             <th>Stock In Quantity</th>
//             <th>Stock Out Quantity</th>
//             <th>Closing Stock</th>
//             <th>Stock Holder ID</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stockData.length > 0 ? (
//             stockData.map((item, index) => (
//               <tr key={`${item.product_id}-${index}`}>
//                 <td>{item.product_id}</td>
//                 <td>{item.product_name}</td>
//                 <td>{item.product_type}</td>
//                 <td>{item.opqty}</td>
//                 <td>{item.stock_in_qty}</td>
//                 <td>{item.stock_out_qty}</td>
//                 <td>{item.closing_stock}</td>
//                 <td>{item.stock_holder_id}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8">No stock data available</td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </Container>
//   );
// };

// export default StockReport;
