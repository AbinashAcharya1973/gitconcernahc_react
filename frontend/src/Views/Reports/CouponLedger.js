import React, { useState, useEffect } from "react";
import { Table, Container, Spinner, Alert, Dropdown, Button } from "react-bootstrap";

const CouponLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [errorLedger, setErrorLedger] = useState(null);
  const [errorStaff, setErrorStaff] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  // Fetch Coupon Ledger data by staff ID
  const fetchLedgerData = async (id) => {
    try {
      setLoadingLedger(true);
      const response = await fetch(`http://localhost:80/api/getcouponledger/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ledger data");
      }
      const dataReceived = await response.json();
      setLedgerData(dataReceived);
      setErrorLedger(null); // Clear any previous error
    } catch (error) {
      setErrorLedger(error.message);
    } finally {
      setLoadingLedger(false);
    }
  };

  // Fetch Staff IDs
  const fetchStaffData = async () => {
    try {
      const response = await fetch("http://localhost:80/api/clients");
      if (!response.ok) {
        throw new Error("Failed to fetch staff IDs");
      }
      const staffReceived = await response.json();
      setStaffData(staffReceived);
      setErrorStaff(null); // Clear any previous error
    } catch (error) {
      setErrorStaff(error.message);
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  // Handle staff selection
  const handleStaffSelect = (id) => {
    setSelectedStaffId(id);
    fetchLedgerData(id);
  };

  // Reset staff selection and ledger data
  const resetFilter = () => {
    setSelectedStaffId("");
    setLedgerData([]);
  };

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
      <h2>Coupon Ledger</h2>

        {/* Dropdown for staff selection */}
        {loadingStaff ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading staff data...</span>
          </Spinner>
        ) : errorStaff ? (
          <Alert variant="danger">Error fetching staff data: {errorStaff}</Alert>
        ) : (
          <>
            <Dropdown onSelect={handleStaffSelect}>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {selectedStaffId ? `Selected Client: ${selectedStaffId}` : "Select Client"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {staffData.map((staffs) => (
                  <Dropdown.Item key={staffs.client_id} eventKey={staffs.client_id}>
                    {staffs.client_name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="secondary" onClick={resetFilter} className="ms-2 btn-sm">
              Reset Filter
            </Button>

            {/* Conditional rendering for ledger data */}
            {selectedStaffId ? (
              loadingLedger ? (
                <Spinner animation="border" role="status" className="mt-3">
                  <span className="visually-hidden">Loading ledger data...</span>
                </Spinner>
              ) : errorLedger ? (
                <Alert variant="danger" className="mt-3">
                  Error fetching ledger data: {errorLedger}
                </Alert>
              ) : (
                <Table striped bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>SrNo</th>
                      <th>Tdate</th>
                      <th>Particulars</th>
                      <th>Dr</th>
                      <th>Cr</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(ledgerData) && ledgerData.length > 0 ? (
                      ledgerData.map((entry, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td> {/* Serial Number */}
                          <td>{entry.tdate}</td> {/* Transaction Date */}
                          <td>{entry.particulars}</td> {/* Particulars */}
                          <td>{entry.dr}</td> {/* Debit */}
                          <td>{entry.cr}</td> {/* Credit */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No coupon ledger data available for the selected staff</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3">Total</td>
                      <td>{totalDr.toFixed(2)}</td>
                      <td>{totalCr.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3">Closing Balance</td>
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
              )
            ) : (
              <Alert variant="info" className="mt-3">
                Please select a staff member to view the coupon ledger.
              </Alert>
            )}
          </>
        )}
    </Container>
  );
};

export default CouponLedger;
