import React, { useState } from 'react';
import './PayModal.css';
import config from '../../config';

const PayModal = ({ show, handleClose, transactionData }) => {
  const [payingAmount, setPayingAmount] = useState('');
  const [payType, setPayType] = useState('cash');
  const [datedCheque, setDatedCheque] = useState('');
  const [chequeDetail, setChequeDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePaymentTypeChange = (e) => {
    const selectedType = e.target.value;
    setPayType(selectedType);
    if (selectedType !== 'cheque') {
      setDatedCheque('');
      setChequeDetail('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!transactionData.transactionId || !payingAmount || !transactionData.cusId) {
      setError("Missing required fields. Please check all values.");
      return;
    }

    if (!payingAmount || payingAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (parseFloat(payingAmount) > parseFloat(transactionData.due)) {
      setError("Paying amount cannot be greater than due amount.");
      return;
    }

    // Additional validation for cheque payments
    if (payType === 'cheque' && (!datedCheque || !chequeDetail)) {
      setError("Please fill in all cheque details.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${config.BASE_URL}/api/transactions/pay/${transactionData.transactionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          payingAmount: parseFloat(payingAmount),
          cusId: transactionData.cusId,
          payType: payType,
          datedCheque: payType === 'cheque' ? datedCheque : null,
          chequeDetail: payType === 'cheque' ? chequeDetail : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Payment failed');
      }

      alert('Payment successful');
      handleClose();

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="pay-modal-overlay">
      <div className="pay-modal">
        <div className="pay-modal-content">
          <h4>Pay Transaction</h4>
          <div className="invoice-details">
            <p><strong>Transaction ID:</strong> {transactionData.transactionId}</p>
            <p className='visually-hidden'><strong>Customer ID:</strong> {transactionData.cusId}</p>  
            <br />
            <p><strong>Total Amount:</strong> Rs {parseFloat(transactionData.totalAmount || 0).toFixed(2)}</p>
            <p><strong>Total Paid Amount:</strong> Rs {parseFloat(transactionData.paidAmount || 0).toFixed(2)}</p>
            <p><strong>Total Due Amount:</strong> Rs {parseFloat(transactionData.due || 0).toFixed(2)}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="payingAmount">Paying Amount (Rs)</label>
              <input
                type="number"
                id="payingAmount"
                className="form-control"
                value={payingAmount}
                onChange={(e) => setPayingAmount(e.target.value)}
                placeholder="Enter amount"
                required
                max={transactionData.due}
                disabled={isSubmitting}
                step="0.01"
              />
            </div>

            <div className="payment-details">
              <div className="payment-details-amount">
                <input
                  type="radio"
                  name="payType"
                  id="cash"
                  value="cash"
                  checked={payType === 'cash'}
                  onChange={handlePaymentTypeChange}
                  disabled={isSubmitting}
                  className="payment-method"
                />
                <label htmlFor="cash" id="label" className="payment-card">
                  Cash Payment
                </label>
              </div>
              <div className="payment-details-amount">
                <input
                  type="radio"
                  name="payType"
                  id="cheque"
                  value="cheque"
                  checked={payType === 'cheque'}
                  onChange={handlePaymentTypeChange}
                  disabled={isSubmitting}
                  className="payment-method"
                />
                <label htmlFor="cheque" id="label" className="payment-card">
                  Cheque Payment
                </label>
              </div>
            </div>

            {payType === 'cheque' && (
              <div className="cheque-details">
                <div className="form-group">
                  <label htmlFor="datedCheque">Cheque Date</label>
                  <input
                    type="date"
                    id="datedCheque"
                    className="form-control"
                    value={datedCheque}
                    onChange={(e) => setDatedCheque(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="chequeDetail">Cheque Details</label>
                  <input
                    type="text"
                    id="chequeDetail"
                    className="form-control"
                    value={chequeDetail}
                    onChange={(e) => setChequeDetail(e.target.value)}
                    placeholder="Bank name, cheque number etc."
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            {error && <div className="alert alert-danger mt-2">{error}</div>}
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayModal;