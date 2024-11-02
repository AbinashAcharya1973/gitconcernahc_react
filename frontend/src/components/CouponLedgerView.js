import React, { useEffect, useState } from "react";
import { Table, Alert, Container } from "react-bootstrap";

const CouponLedgerView = ({ clientId }) => {
  const [ledgerData, setLedgerData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch ledger data for the specified client
    const fetchLedgerData = async () => {
      try {
        const response = await fetch(`http://localhost:80/api/getcouponledger/${clientId}`);
        if (!response.ok) throw new Error("Failed to fetch ledger data");
        
        const data = await response.json();
        setLedgerData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchLedgerData();
  }, [clientId]);
   // Calculate totals for Dr and Cr columns
   const calculateTotals = () => {
    let totalDr = 0;
    let totalCr = 0;

    ledgerData.forEach((entry) => {
      totalDr += parseFloat(entry.dr) || 0;
      totalCr += parseFloat(entry.cr) || 0;
    });

    return { totalDr, totalCr };
  };

  // Calculate closing balance and determine which column to place it in
  const getClosingBalance = (totalDr, totalCr) => {
    const balance = Math.abs(totalDr - totalCr);

    if (totalDr > totalCr) {
      // Add the balance to Cr when Dr is larger
      return { closingDr: 0, closingCr: balance };
    } else if (totalCr > totalDr) {
      // Add the balance to Dr when Cr is larger
      return { closingDr: balance, closingCr: 0 };
    }

    return { closingDr: 0, closingCr: 0 }; // Both are balanced
  };

  const { totalDr, totalCr } = calculateTotals();
  const { closingDr, closingCr } = getClosingBalance(totalDr, totalCr);
  return (
    <Container>      
      {error && <Alert variant="danger">Error: {error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Debit</th>
            <th>Credit</th>            
          </tr>
        </thead>
        <tbody>
          {ledgerData.length > 0 ? (
            ledgerData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.tdate}</td>
                <td>{entry.particulars}</td>
                <td>{entry.dr}</td>
                <td>{entry.cr}</td>                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No ledger data available</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">Total</td>
            <td>{totalDr.toFixed(2)}</td>
            <td>{totalCr.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="2">Closing Balance</td>
            {/* Place the closing balance in the column where the total is smaller */}
            {totalDr > totalCr ? (
              <>
                <td>0.00</td>
                <td>{closingCr.toFixed(2)}</td>
              </>
            ) : (
              <>
                <td>{closingDr.toFixed(2)}</td>
                <td>0.00</td>
              </>
            )}
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
};

export default CouponLedgerView;
