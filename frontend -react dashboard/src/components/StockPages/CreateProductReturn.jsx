import React, { useEffect, useState } from 'react';
import config from '../../config';
import Table from '../Table/Table';

const CreateProductReturn = () => {
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);
    const [returnDetails, setReturnDetails] = useState([]);
    const Columns = ["#", "product", "Qty", "price", "Warranty", "invoice Products #", "Stock #"];

    const getSriLankanTime = () => {
        const now = new Date();
        const sriLankanOffset = 5.5 * 60 * 60 * 1000;
        const sriLankanTime = new Date(now.getTime() + sriLankanOffset);
        return sriLankanTime.toISOString().slice(0, 16);
    };

    const initialFormData = {
        invoiceNo: '',
        user: '',
        userName: '',
        store: '',
        returnDate: getSriLankanTime(),
        prodName: '',
        returnQty: '',
        returnType: '',
        returnNote: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchStores();
        fetchUsers();
        fetchUserId();
    }, []);

    const handleRowClick = (rowData) => {
        setReturnDetails((prevDetails) => [
            ...prevDetails,
            {
                prodName: rowData[1],
                returnQty: '',
                returnType: '',
                returnNote: '',
            },
        ]);
    };

    const handleDynamicFieldChange = (index, name, value) => {
        const updatedDetails = [...returnDetails];
        updatedDetails[index][name] = value;
        setReturnDetails(updatedDetails);
    };

    const fetchInvoiceData = async (invoiceNo) => {
        try {
            const response = await fetch(`${config.BASE_URL}/invoiceProduct/${invoiceNo}`);
            if (response.ok) {
                const invoiceData = await response.json();
                const formattedData = invoiceData.map((inv) => [
                    inv.product?.productId,
                    inv.product?.productName,
                    inv.invoiceQty,
                    inv.unitAmount,
                    inv.product?.productWarranty || " - ",
                    inv.id,
                    inv.stock?.stockId,
                ]);
                setData(formattedData);
                return invoiceData;
            } else {
                console.error('invoice not found');
            }
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    const fetchUserId = async () => {
        const userName = localStorage.getItem('userName');
        if (userName) {
            try {
                const response = await fetch(`${config.BASE_URL}/user/name/${userName}`);
                if (!response.ok) throw new Error('User not found');
                const userData = await response.json();

                setFormData(prev => ({
                    ...prev,
                    user: userData.userId,
                    userName: userData.userName,
                }));
            } catch (err) {
                setError(err.message);
            }
        } else {
            setError('No username found in local storage.');
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "invoiceNo" && value) {
            await fetchInvoiceData(value);
        }
    };

    const fetchInvoiceId = async (invoiceNo) => {
        try {
            const response = await fetch(`${config.BASE_URL}/invoice/invoiceNo/${invoiceNo}`);
            if (response.ok) {
                const invoiceData = await response.json();
                return invoiceData.invoiceId;
            } else {
                throw new Error('Invoice not found');
            }
        } catch (error) {
            setError(error.message);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!formData.invoiceNo) {
            setError("Please enter an invoice number");
            return;
        }

        if (returnDetails.length === 0) {
            setError("Please provide return details for the products.");
            return;
        }

        try {
            const invoiceId = await fetchInvoiceId(formData.invoiceNo);
            if (!invoiceId) {
                setError("Invoice ID not found for the entered invoice number");
                return;
            }

            // Create return entry
            const returnResponse = await fetch(`${config.BASE_URL}/return`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    returnItemDate: formData.returnDate,
                    storeId: formData.store,
                    userId: formData.user,
                    invoiceId,
                }),
            });

            if (!returnResponse.ok) {
                const errorData = await returnResponse.json();
                throw new Error(errorData.message || "Failed to create return.");
            }

            const createdReturn = await returnResponse.json();

            // Gather return items with proper type conversion
            const returnItems = await Promise.all(returnDetails.map(async (detail) => {
                const matchingRow = data.find(row => row[1] === detail.prodName);

                if (!matchingRow) {
                    throw new Error(`No matching row found for product: ${detail.prodName}`);
                }

                // Fixed array index access - using correct indices based on Columns array
                const unitAmount = parseFloat(matchingRow[3]);
                const invoiceProductId = matchingRow[5];
                const stockId = matchingRow[6];

                // Add validation to ensure values exist
                if (!invoiceProductId || !stockId || !createdReturn.returnItemId) {
                    console.error("Debug values:", {
                        invoiceProductId,
                        stockId,
                        returnItemId: createdReturn.returnItemId,
                        matchingRow
                    });
                    throw new Error(`Missing required ID values for product: ${detail.prodName}`);
                }

                if (isNaN(invoiceProductId) || isNaN(stockId) || isNaN(createdReturn.returnItemId)) {
                    throw new Error(`Invalid ID conversion for product: ${detail.prodName}`);
                }

                const returnAmount = unitAmount * parseFloat(detail.returnQty);

                if (isNaN(returnAmount)) {
                    throw new Error(`Invalid return amount calculation for product: ${detail.prodName}`);
                }

                return {
                    returnQty: parseInt(detail.returnQty, 10),
                    returnItemType: detail.returnType,
                    returnNote: detail.returnNote || "",
                    invoiceProductId: invoiceProductId,
                    stockId: stockId,
                    returnItemId: createdReturn.returnItemId,
                    returnAmount,
                    returnDate: formData.returnDate,
                    productId: matchingRow[0],
                };
            }));

            console.log("Return items to be sent:", returnItems);

            const returnProductResponse = await fetch(`${config.BASE_URL}/returnProduct`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(returnItems),
            });

            if (!returnProductResponse.ok) {
                const errorData = await returnProductResponse.json();
                console.error("Failed to create return products:", errorData);
                throw new Error(errorData.message || "Failed to create return products.");
            }

            const responseData = await returnProductResponse.json();
            console.log("Success response from /returnProduct:", responseData);

            setSuccessMessage("Return created successfully.");
            resetForm();
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            setError(error.message);
        }
    };


    const fetchStores = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/stores`);
            if (!response.ok) throw new Error('Failed to fetch stores');
            const storesData = await response.json();
            setStores(storesData);

            if (storesData.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    store: storesData[0].storeId,
                }));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const usersData = await response.json();
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData((prev) => ({
            ...prev,
            invoiceNo: '',
            prodName: '',
            returnQty: '',
            returnType: '',
            returnNote: '',
        }));
        setData([]);
        setReturnDetails([]);
        window.location.reload();
    }

    return (
        <div className="scrolling-container">
            <h4>Create Product Return</h4>
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className='mb-2' style={{ paddingLeft: '20px' }}>
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Invoice Number</label>
                        <input type="number" className="form-control" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} onWheel={(e) => e.target.blur()} />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Cashier</label>
                        <input type="text" name="userName" value={formData.userName} className="form-control" disabled />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Store</label>
                        <input type="text" className="form-control" name="store"
                            value={stores.find(store => store.storeId === formData.store)?.storeName || ""}
                            disabled
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Date</label>
                        <input type="datetime-local" className="form-control" name="returnDate" value={formData.returnDate} onChange={handleChange} disabled />
                    </div>

                    <div className="col-md-12">
                        <div className="product-table">
                            <Table
                                data={data || []}
                                columns={Columns}
                                showSearch={false}
                                showButton={false}
                                showActions={false}
                                showRow={false}
                                showDate={false}
                                showPDF={false}
                                onRowClick={handleRowClick}
                            />
                        </div>
                    </div>

                    {returnDetails.map((detail, index) => (
                        <div className='row' key={index}>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="prodName"
                                    value={detail.prodName}
                                    onChange={(e) => handleDynamicFieldChange(index, 'prodName', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Return Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="returnQty"
                                    value={detail.returnQty}
                                    onChange={(e) => handleDynamicFieldChange(index, 'returnQty', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Return Type</label>
                                <select
                                    name="returnType"
                                    className='form-control'
                                    value={detail.returnType}
                                    onChange={(e) => handleDynamicFieldChange(index, 'returnType', e.target.value)}
                                >
                                    <option value=" ">Select Options</option>
                                    <option value="Refund">Refund</option>
                                    <option value="Damage">Damage</option>
                                    <option value="Exchange ">Exchange </option>
                                    <option value="Warranty">Warranty Claim</option>
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Return Note</label>
                                <textarea
                                    className="form-control"
                                    name="returnNote"
                                    value={detail.returnNote}
                                    onChange={(e) => handleDynamicFieldChange(index, 'returnNote', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </form>

            <div className="d-grid d-md-flex me-md-2 justify-content-end px-5">
                <button className="btn btn-danger btn-md mb-2" type="button" onClick={resetForm}>Clear</button>
                <button className="btn btn-primary btn-md mb-2" type="submit" onClick={handleSubmit}>Proceed</button>
            </div>
        </div>
    );
};

export default CreateProductReturn;