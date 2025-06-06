import { useEffect, useState } from "react";
import Table from '../Table/Table';
import config from '../../config';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate } from 'react-router-dom'
import { Download, Eye } from 'lucide-react';

const Invoice = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    "ID", "Invoice No", "Date/Time", "Type", "Customer", "Customer Office", "Purchase Order No", "Store",
    "Transaction Type", "Total Amount", "Due", "Purchase Order img/pdf", "Print"
  ];

  useEffect(() => {
    fetchSalesHistory();
  }, []);

  const fetchSalesHistory = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoices`);
      if (!response.ok) {
        setError('Failed to fetch Sales Invoices');
        return;
      }
      const invoices = await response.json();

      const filteredInvoices = invoices.filter(invoice => invoice.status === "invoice" &&  invoice.draft==="false");

      const transactionPromises = filteredInvoices.map(async (invoice) => {
        const transactionResponse = await fetch(`${config.BASE_URL}/transaction/invoice/${invoice.invoiceId}`);
        if (transactionResponse.ok) {
          return await transactionResponse.json();
        }
        return [];
      });

      const transactionsData = await Promise.all(transactionPromises);

      const formattedData = filteredInvoices.map((invoice, index) => {
        const invoiceDate = new Date(invoice.invoiceDate);

        const formattedInvoiceDate = `${String(invoiceDate.getHours()).padStart(2, '0')}:${String(invoiceDate.getMinutes()).padStart(2, '0')} ${String(invoiceDate.getDate()).padStart(2, '0')}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-${invoiceDate.getFullYear()}`;

        const transactionPrice = transactionsData[index]?.reduce((total, transaction) => total + transaction.paid, 0);
        const transactionDue = transactionsData[index]?.reduce((total, transaction) => total + transaction.due, 0);
        const transactionTypes = transactionsData[index]?.map((transaction) => transaction.transactionType).join(', ') || "Unknown";

        const filename = invoice.image ? invoice.image.split('/').pop() : null;

        const currentYear = new Date().getFullYear().toString().slice(-2);

        return [
          invoice.invoiceId,
          // "INV-"+invoice.invoiceNo+"-"+currentYear,
          invoice.invoiceNo,
          formattedInvoiceDate,
          invoice.status,
          invoice.customer.cusName,
          invoice.customer.cusOffice,
          invoice.purchaseNo,
          invoice.store,
          transactionTypes,
          transactionPrice,
          transactionDue,

          filename ? (
            <a href={`${config.BASE_URL}/download/invoice/${filename}`} download>
              <button className="btn btn-success" style={{fontSize: "12px"}}><Download /></button>
            </a>
          ) : (
            "No Image"
          ),
          <Link to={`/createInvoice/${invoice.store}/${invoice.invoiceNo}`}>
            <button className="btn btn-primary" style={{fontSize: "12px"}}>Print</button>
          </Link>,
        ];
      });

      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const title = 'History';
  const invoice = 'History.pdf';

  const handleDelete = async (rowIndex) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this?");
    const invoiceId = data[rowIndex][0];
    if (confirmDelete) {
      try {
        const deleteEndpoints = [
          `/invoice/${invoiceId}`,
        ];

        for (const endpoint of deleteEndpoints) {
          const response = await fetch(`${config.BASE_URL}${endpoint}`, { method: 'DELETE' });
          if (!response.ok) {
            const message = await response.text();
            // console.error(`Failed to delete from ${endpoint}:`, message);
            // throw new Error(`Failed to delete data from ${endpoint}`);
          }
        }

        setData((prevData) => prevData.filter(item => item[0] !== invoiceId));
        fetchSalesHistory();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const invoiceType = "invoice";
  const navigate = useNavigate();

  return (
    <div>
      <div className="scrolling-container">
        <div className="new-sales-container">
          <h4>Invoice</h4>

          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (<p></p>)}
          <div className="payment-form-button d-grid d-md-flex me-md-2 justify-content-end ">
            <Link to={`/sales/new/${invoiceType}`}> <button className="btn btn-warning" style={{fontSize: "13px"}}>Create Sales Invoice</button></Link>
          </div>
          <Table
            data={data}
            columns={columns}
            title={title}
            invoice={invoice}
            onEdit={(rowIndex) => {
              const invoiceId = data[rowIndex][0];
              const invoiceNo = data[rowIndex][1];
              const cusName = data[rowIndex][3];
              navigate(`/DraftSales/${invoiceId}/${invoiceType}`);
            }}
            showButton={false}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Invoice;
