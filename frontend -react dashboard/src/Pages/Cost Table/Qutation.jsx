import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import './Qutation.css'

function Qutation() {
  const [costings, setCostings] = useState([]); // Store the fetched data
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows

  const navigate = useNavigate();

  const handleViewClick = (id) => {
    navigate(`/qutation-invoice/${id}`);  // Pass header.id as URL parameter
  };

  // Fetch data from the backend
  useEffect(() => {
    axios.get(`${config.BASE_URL}/costings`)
      .then(response => {
        setCostings(response.data);
      })
      .catch(error => {
        console.error('Error fetching costings:', error);
      });
  }, []);

  // Toggle row expansion
  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mt-3 container-fluid">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Costing Data</h1>
        <button
          className="btn btn-warning"
          onClick={() => navigate('/costing-table')}
        >
          Create Quotation +
        </button>
      </div>

      <div style={{ borderRadius: "5px"}}>
        <table className="mt-4 table table-bordered table-dark  table-striped ">
          <thead>
            <tr>
              <th>Quote No</th>
              <th>Total Amount</th>
              <th>Total Profit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {costings.map(header => (
              <React.Fragment key={header.id}>
                {/* Costing Header Row */}
                <tr>
                  <td>{header.id}</td>
                  <td>Rs. {header.total_amount}</td>
                  <td>Rs. {header.total_profit}</td>
                  <td style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => toggleRow(header.id)}
                      style={{ marginRight: '8px' }} // Adds space between buttons
                    >
                      {expandedRows[header.id] ? (
                        <>
                          <ChevronUp />
                        </>
                      ) : (
                        <>
                          <ChevronDown />
                        </>
                      )}
                    </button>
                    <button className="btn btn-success" onClick={() => handleViewClick(header.id)}>
                      <Eye />
                    </button>
                  </td>

                </tr>
                {/* Costing Details (Visible when expanded) */}
                {expandedRows[header.id] && (
                  <tr>
                    <td colSpan="4">
                      <table className="table table-sm table-striped">
                        <thead>
                          <tr>
                            <th>S/N</th>
                            <th>Customer Product Description</th>
                            <th>Product Code</th>
                            <th>Description</th>
                            <th>Warranty</th>
                            <th>Supplier</th>
                            <th>Unit Cost</th>
                            <th>Our Margin %</th>
                            <th>Our Margin Value</th>
                            <th>Price + Margin</th>
                            <th>Selling Rate Before Discount</th>
                            <th>Selling Rate Before Discount Rounded To Near 10</th>
                            <th>UOM</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Discount %</th>
                            <th>Discount Value</th>
                            <th>Discounted Price</th>
                            <th>Amount</th>
                            <th>Profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {header.CostingDetails.map(detail => (
                            <tr key={detail.id}>
                              <td>{detail.id}</td>
                              <td>{detail.description_customer}</td>
                              <td>{detail.product_code}</td>
                              <td>{detail.description}</td>
                              <td>{detail.warranty}</td>
                              <td>{detail.supplier}</td>
                              <td>Rs. {detail.unit_cost}</td>
                              <td>{detail.our_margin_percentage}%</td>
                              <td>Rs. {detail.our_margin_value}</td>
                              <td>Rs. {detail.price_plus_margin}</td>
                              <td>Rs. {detail.selling_rate}</td>
                              <td>Rs. {detail.selling_rate_rounded}</td>
                              <td>{detail.uom}</td>
                              <td>{detail.qty}</td>
                              <td>Rs. {detail.unit_price}</td>
                              <td>{detail.discount_percentage}%</td>
                              <td>Rs. {detail.discount_value}</td>
                              <td>Rs. {detail.discounted_price}</td>
                              <td>Rs. {detail.amount}</td>
                              <td>Rs. {detail.profit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Qutation;
