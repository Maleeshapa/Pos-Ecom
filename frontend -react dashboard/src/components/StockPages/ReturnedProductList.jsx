import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table';
import config from '../../config';

const ReturnedProductList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const Columns = [
        "Id",
        'Credit Note No',
        'Return Date',
        'Customer Name',
        'Customer Address',
        'store',
        'Handle By',
        'Credit Note'
    ];
    const btnName = 'Create a Return';

    const navigate = useNavigate();

    const handleCreateReturn = () => {
        navigate('/return/create');
    };

    useEffect(() => {
        fetchReturn();
    });

    const fetchReturn = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/returns`);
            if (!response.ok) {
                throw new Error('Failed to fetch return list');
            }
            const returns = await response.json();

            const formattedData = await Promise.all(returns.map(async (returnItem) => {
                const returnDate = new Date(returnItem.returnItemDate);
                const formattedReturnDate = `${String(returnDate.getHours()).padStart(2, '0')}:${String(returnDate.getMinutes()).padStart(2, '0')} ${String(returnDate.getDate()).padStart(2, '0')}-${String(returnDate.getMonth() + 1).padStart(2, '0')}-${returnDate.getFullYear()}`;

                const customerResponse = await fetch(`${config.BASE_URL}/customer/${returnItem.invoice.cusId}`);
                if (!customerResponse.ok) throw new Error("Failed to fetch customer");
                const customer = await customerResponse.json(); 


                const currentYear = new Date().getFullYear().toString().slice(-2);

                return [
                    returnItem.returnItemId,
                    `CR-${returnItem.invoice?.invoiceNo}-${currentYear}`,
                    formattedReturnDate,
                    customer.cusName,
                    customer.cusAddress,
                    returnItem.invoice.store,
                    returnItem.user?.userName,
                    (
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/createCR/${returnItem.invoice.store}/${returnItem.invoice?.invoiceNo}/${returnItem.returnItemId}`)}
                            style={{ fontSize: "12px" }}
                        >
                            Credit Note
                        </button>
                    )
                ];
            }));

            setData(formattedData);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const title = 'Returned Product List';
    const invoice = 'Returned Product List.pdf';

    return (
        <div>
            <div className="scrolling-container">
                <h4>Credit Note</h4>
                <div className="payment-form-button d-grid d-md-flex me-md-2 justify-content-end ">
                    <button onClick={handleCreateReturn} className="btn btn-warning" style={{ fontSize: "12px" }}>Create Credit Note</button>
                </div>
                <div className="">
                    <Table
                        data={data}
                        columns={Columns}
                        showButton={false}
                        showActions={false}
                        title={title}
                        invoice={invoice}
                        showDate={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReturnedProductList;
