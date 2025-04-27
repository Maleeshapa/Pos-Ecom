import React, { useEffect, useState } from "react";
import config from '../../config';
import { ChevronDown, ChevronUp, Eye, Phone } from "lucide-react";
import './DueCus.css';
import PayModal from './PayModal';
import { useNavigate } from 'react-router-dom';

const ViewDue = () => {
  const columns = ['Customer Name', 'Customer Code', 'Address', 'Phone', 'Total Due Amount', 'Actions'];
  const expandedColumns = ['Transaction ID', 'Date', 'Total Amount', 'Paid Amount', 'Due Amount', 'Actions'];
  
  const [dueTxnData, setDueTxnData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({}); // Store additional customer details

  const navigate = useNavigate();

  useEffect(() => {
    fetchDueTransactions();
  }, []);

  const fetchDueTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch transactions with due amount > 0
      const response = await fetch(`${config.BASE_URL}/api/transactions/due`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch due transactions');
      }

      const transactions = await response.json();
      
      // Filter out transactions with missing customer data
      const validTransactions = transactions.filter(
        txn => txn.customer && txn.customer.cusId
      );
      
      setDueTxnData(validTransactions);
      
      // Group transactions by customer
      updateGroupedData(validTransactions);

      // Fetch additional customer details for all unique customers
      await fetchCustomerDetails(validTransactions);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching due transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerDetails = async (transactions) => {
    try {
      // Get unique customer IDs
      const customerIds = [...new Set(transactions.map(txn => txn.customer.cusId))];
      
      // Fetch details for each customer
      const details = {};
      await Promise.all(customerIds.map(async (cusId) => {
        const response = await fetch(`${config.BASE_URL}/customer/${cusId}`);
        if (response.ok) {
          const customer = await response.json();
          details[cusId] = {
            phone: customer.cusPhone || 'N/A',
            address: customer.cusAddress || 'N/A',
            code: customer.cusCode || 'N/A'
          };
        }
      }));
      
      setCustomerDetails(details);
    } catch (err) {
      console.error('Error fetching customer details:', err);
    }
  };

  const updateGroupedData = (data) => {
    // Group data by customer ID and calculate total due amounts
    const grouped = data.reduce((acc, transaction) => {
      if (!transaction.customer) return acc;
      
      const customerId = transaction.customer.cusId;
      
      // Find existing customer group or create new one
      const existingGroup = acc.find(group => group.cusId === customerId);
      
      if (existingGroup) {
        // Add to existing customer group
        existingGroup.transactions.push(transaction);
        existingGroup.totalDueAmount += Number(transaction.due || 0);
      } else {
        // Create new customer group
        acc.push({
          cusId: customerId,
          customerName: transaction.customer.cusName || 'Unknown',
          totalDueAmount: Number(transaction.due || 0),
          transactions: [transaction]
        });
      }
      
      return acc;
    }, []);
    
    setGroupedData(grouped);
  };

  const toggleRowExpansion = (customerId) => {
    if (expandedRows.includes(customerId)) {
      setExpandedRows(expandedRows.filter(id => id !== customerId));
    } else {
      setExpandedRows([...expandedRows, customerId]);
    }
  };

  const handlePayClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
    // Refresh data after payment
    fetchDueTransactions();
  };

  const handleViewDetails = (cusId) => {
    navigate(`/cus-due/${cusId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return `Rs ${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    // Simple formatting - you can enhance this based on your needs
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  return (
    <div>
      <div className="scrolling-container">
        <div className="new-sales-container">
          <h4>Due Customers</h4>
          
          {isLoading ? (
            <div className="text-center my-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading due customers...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              <p className="mb-0">Error: {error}</p>
              <button 
                className="btn btn-outline-danger mt-2" 
                onClick={fetchDueTransactions}
              >
                Retry
              </button>
            </div>
          ) : groupedData.length === 0 ? (
            <div className="alert alert-info" role="alert">
              <p>No customers with dues found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="due-cus-table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupedData.map((customer) => (
                    <React.Fragment key={customer.cusId}>
                      <tr>
                        <td>{customer.customerName}</td>
                        <td>{customerDetails[customer.cusId]?.code || 'N/A'}</td>
                        <td>{customerDetails[customer.cusId]?.address || 'N/A'}</td>

                        {/* <td>
                          <div className="d-flex align-items-center gap-1">
                            <Phone size={16} />
                            {formatPhoneNumber(customerDetails[customer.cusId]?.phone)}
                          </div>
                        </td> */}

<td>
  <div className="d-flex align-items-center gap-1">
    <Phone size={16} />
    <a href={`tel:${customerDetails[customer.cusId]?.phone}`} className="text-decoration-none">
      {formatPhoneNumber(customerDetails[customer.cusId]?.phone)}
    </a>
  </div>
</td>


                        <td>{formatCurrency(customer.totalDueAmount)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => toggleRowExpansion(customer.cusId)}
                            >
                              {expandedRows.includes(customer.cusId) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          
                          </div>
                        </td>
                      </tr>
                      {expandedRows.includes(customer.cusId) && (
                        <tr className="expanded-row">
                          <td colSpan={columns.length}>
                            <div className="px-4 py-3">
                              <h6 className="mb-2">Transaction History</h6>
                              <div className="table-responsive">
                                <table className="expanded-table">
                                  <thead>
                                    <tr>
                                      {expandedColumns.map((column, index) => (
                                        <th key={index}>{column}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {customer.transactions.map((transaction) => (
                                      <tr key={transaction.transactionId}>
                                        <td>{transaction.transactionId}</td>
                                        <td>{formatDate(transaction.createdAt)}</td>
                                        <td>{formatCurrency(transaction.totalAmount)}</td>
                                        <td>{formatCurrency(transaction.paidAmount)}</td>
                                        <td>{formatCurrency(transaction.due)}</td>
                                        <td>
                                          <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => handlePayClick(transaction)}
                                            disabled={Number(transaction.due) <= 0}
                                          >
                                            Make Payment
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {showModal && selectedTransaction && (
            <PayModal
              show={showModal}
              handleClose={handleCloseModal}
              transactionData={selectedTransaction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDue;