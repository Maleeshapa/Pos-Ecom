import React, { useContext, useEffect, useState } from 'react';
import config from '../../../config';
import { jsPDF } from "jspdf";
import './CreditNote.css'
import { Link, useParams } from 'react-router-dom';
import one from '../../../assets/1.jpg';
import two from '../../../assets/2.jpg';
import three from '../../../assets/3.jpg';
import { NoteContext } from '../../../Context/NoteContext';

const CreditNote = () => {
    const { store, invoiceNo, returnItemId } = useParams();
    const [colkan, setColkan] = useState(false)
    const [haman, setHaman] = useState(false)
    const [terra, setTerra] = useState(false)
    const [formData, setFormData] = useState({
        invoiceNo: '',
        invoiceDate: '',
        PurchaseOrder: '',
        cusName: '',
        cusJob: '',
        cusOffice: '',
        cusAddress: '',
        proforma: '',
        purchaseOrder: '',
    });
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const [Transaction, setTransaction] = useState([]);

    const { note } = useContext(NoteContext);

    useEffect(() => {
        if (invoiceNo) {
            fetchInvoiceData(invoiceNo);
        }
    }, [invoiceNo]);

    const fetchInvoiceData = async (invoiceNo) => {
        try {
            const response = await fetch(`${config.BASE_URL}/invoice/invoiceNo/${invoiceNo}`);
            if (response.ok) {
                const invoiceData = await response.json();

                const generatedProformaNo = `CR-${invoiceData.invoiceNo}-${new Date(invoiceData.invoiceDate).getFullYear().toString().slice(-2)}`;

                setFormData({
                    invoiceNo: invoiceData.invoiceNo,
                    invoiceDate: new Date(invoiceData.invoiceDate).toISOString().split("T")[0],
                    cusName: invoiceData.customer.cusName,
                    cusJob: invoiceData.customer.cusJob,
                    cusOffice: invoiceData.customer.cusOffice,
                    cusAddress: invoiceData.customer.cusAddress,
                    cusPhone: invoiceData.customer.cusPhone,
                    cusEmail: invoiceData.customer.cusEmail,
                    proforma: generatedProformaNo,
                    PurchaseOrder: invoiceData.purchaseNo,
                });

                if (invoiceData.invoiceId) {
                    fetchTransaction(invoiceData.invoiceId);
                }
                if (store === 'colkan') {
                    setColkan(true)
                }
                if (store === 'haman') {
                    setHaman(true)
                }
                if (store === 'terra') {
                    setTerra(true)
                }
            } else {
                alert('Invoice not found');
            }
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            alert('An error occurred while fetching invoice data');
        }
    };

    useEffect(() => {
        if (returnItemId) {
            fetchInvoiceProducts(returnItemId)
        }
    }, [returnItemId])

    const fetchInvoiceProducts = async (returnItemId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/returnProduct/return/${returnItemId}`);
            if (response.ok) {
                const data = await response.json();
                setInvoiceProducts(data);
            } else {
                alert('No invoice products found');
            }
        } catch (error) {
            console.error('Error fetching invoice products:', error);
            alert('An error occurred while fetching invoice products');
        }
    };

    const fetchTransaction = async (invoiceId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/transaction/invoice/${invoiceId}`);
            if (response.ok) {
                const transactionData = await response.json();
                setTransaction(transactionData);
                console.log(transactionData);
            } else {
                alert('No Transaction found');
            }
        } catch (error) {
            console.error('Error fetching Transaction:', error);
            alert('An error occurred while fetching the transaction');
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-card');

        if (printContent) {
            const doc = new jsPDF();

            doc.html(printContent, {
                callback: function (doc) {
                    const totalPages = doc.internal.getNumberOfPages();

                    // Loop through each page to add a footer with page number
                    for (let i = 1; i <= totalPages; i++) {
                        doc.setPage(i);
                        doc.setFontSize(10);
                        const pageWidth = doc.internal.pageSize.width;
                        const pageHeight = doc.internal.pageSize.height;

                        const footerText = `Page ${i} of ${totalPages}`;
                        const textWidth = doc.getTextWidth(footerText);

                        // Center the footer text at the bottom of each page
                        doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
                    }

                    doc.autoPrint();
                    window.open(doc.output('bloburl'), '_blank');
                    doc.save('invoice.pdf');
                },
                x: 10,
                y: 10,
                width: 190,
                windowWidth: 800,
            });
        } else {
            console.error('Invoice card not found!');
        }
    };

    const [checkboxStates, setCheckboxStates] = useState({
        address: true,
        bank: false,
        phone: false,
        email: false,
        note: false
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setCheckboxStates({
            address: params.get('address') === 'true',
            bank: params.get('bank') === 'true',
            phone: params.get('phone') === 'true',
            email: params.get('email') === 'true',
            note: params.get('note') === 'true',
        });
    }, [invoiceNo]);

    const handleCheckboxChange = (name) => {
        setCheckboxStates((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
        }));
    };

    // Derived states for visibility
    const showAddress = checkboxStates.address;
    const showBank = checkboxStates.bank;
    const showPhone = checkboxStates.phone;
    const showEmail = checkboxStates.email;
    const showNote = checkboxStates.note;

    return (
        <div>
            <div className="scrolling-container">
                <h4>Credit Note</h4>
                <div className="invoice-page">
                    <div className="invoice">
                        <div id="invoice-card">
                            {colkan && (
                                <section className="invoice-header">
                                    <img src={one} alt="" className="header-img" />
                                </section>
                            )}
                            {haman && (
                                <section className="invoice-header">
                                    <img src={two} alt="" className="header-img" />
                                </section>

                            )}
                            {terra && (
                                <section className="invoice-header">
                                    <img src={three} alt="" className="header-img" />
                                </section>
                            )}
                            <div className="type-head text-center">
                                <h4> <b>CREDIT NOTE </b></h4>
                            </div>
                            <section className="billing-details">
                                <div className="invoice-info">
                                    <label><b>Billing Details</b></label>
                                    <div className="details">
                                        {/* <input type="text" className="form-input" name="cusName" value={formData.cusName} /> */}
                                        <p>{formData.cusName}</p>
                                    </div>
                                    <div className="details">
                                        {/* <input type="text" className="form-input" name="cusJob" value=/> */}
                                        <p>{formData.cusJob} </p>
                                    </div>
                                    <div className="details">
                                        {/* <input type="text" className="form-input" name="cusOffice" value= /> */}
                                        <p>{formData.cusOffice}</p>
                                    </div>
                                    {showAddress && (
                                        <div className="details">
                                            {/* <div className="details">
                                                <textarea
                                                    className="form-input"
                                                    name="cusAddress"
                                                    rows="2"
                                                    style={{ resize: "both" }}
                                                    value={formData.cusAddress}
                                                ></textarea>
                                            </div> */}
                                            <p>{formData.cusAddress}</p>
                                        </div>
                                    )}
                                    {showPhone && (
                                        <div className="details">
                                            {/* <input type="text" className="form-input" name="cusPhone" value={formData.cusPhone} /> */}
                                            <p>{formData.cusPhone}</p>
                                        </div>
                                    )}
                                    {showEmail && (
                                        <div className="details">
                                            {/* <input type="text" className="form-input" name="cusEmail" value={formData.cusEmail} /> */}
                                            <p>{formData.cusEmail}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="performa-details-container">
                                    <div className="performa-details">
                                        <label htmlFor="">Credit Note No.</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="proforma"
                                            value={formData.proforma}
                                        />
                                    </div>
                                    <div className="performa-details">
                                        <label htmlFor="">Date</label>
                                        <input
                                            type="date"
                                            className="form-input date"
                                            name="invoiceDate"
                                            value={formData.invoiceDate}
                                        />
                                    </div>
                                    <div className="performa-details">
                                        <label htmlFor="">Invoice No.</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="invoiceNo"
                                            value={formData.invoiceNo}
                                        />
                                    </div>
                                    <div className="performa-details">
                                        <label htmlFor="">Purchase Order No.</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="purchaseOrder"
                                            value={formData.PurchaseOrder}
                                        />
                                    </div>
                                </div>
                            </section>

                            <table className="invoice-table">
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th className='text-center'>Unit Price LKR</th>
                                        <th className='text-center'>Discount LKR</th>
                                        <th className='text-center'>Discounted Price LKR</th>
                                        <th className='text-center'>Amount LKR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5}>No products found for this invoice.</td>
                                        </tr>
                                    ) : (
                                        invoiceProducts.map((invoiceProduct, index) => (
                                            <tr key={index}
                                                className={`table-row`}
                                            >
                                                <td id='table-sn'>{index + 1}</td>
                                                <td id='tableDes'>{invoiceProduct.product.productName}</td>
                                                <td id='table-sn'>{invoiceProduct.returnQty}</td>
                                                <td id='table-sn' className='text-end'>{invoiceProduct.invoiceProduct.unitAmount}</td>
                                                <td id='table-sn' className='text-end'>{invoiceProduct.invoiceProduct.discount}</td>
                                                <td id='table-sn' className='text-end'>{invoiceProduct.invoiceProduct.unitAmount - invoiceProduct.invoiceProduct.discount}</td>
                                                <td id='table-sn' className='text-end'>{(invoiceProduct.returnAmount)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td colSpan={5} rowSpan={5}>
                                            {/* {showBank && (
                                                <>
                                                    Payment mode : Cash or cheque. All cheques are to be drawn in favour of "Colkan Holdings (Pvt) Ltd" and crossed account payee only<br></br>
                                                    {colkan && (
                                                        <>
                                                            Bank:HNB<br></br>
                                                            Account Number : 250010032342<br></br>
                                                            Account Name : Colkan Holdings (Pvt) LTD<br></br>
                                                            Branch Name : Colkan
                                                        </>
                                                    )}

                                                    {haman && (
                                                        <>
                                                            Bank:BOC<br></br>
                                                            Account Number : 93829087<br></br>
                                                            Account Name : Haman<br></br>
                                                            Branch Name : Wellewathe
                                                        </>
                                                    )}

                                                    {terra && (
                                                        <>
                                                            Bank:Sampath Bank<br></br>
                                                            Account Number : 0117 1000 1407<br></br>
                                                            Account Name : Terra walkers<br></br>
                                                            Branch Name : Kirulapona
                                                        </>
                                                    )}
                                                </>
                                            )} */}
                                            {showBank && (
                                                <>
                                                    {/* Payment mode : Cash or cheque. All cheques are to be drawn in favour of "Colkan Holdings (Pvt) Ltd" and crossed account payee only<br></br> */}
                                                    {colkan && (
                                                        <>
                                                            Payment mode : Cash or cheque. All cheques are to be drawn in favour of "Colkan Holdings (Pvt) Ltd" and crossed account payee only<br></br>
                                                            Bank:HNB<br></br>
                                                            Account Number : 250010032342<br></br>
                                                            Account Name : Colkan Holdings (Pvt) LTD<br></br>
                                                            Branch Name : Colkan
                                                        </>
                                                    )}

                                                    {haman && (
                                                        <>
                                                            Payment mode : Cash or cheque. All cheques are to be drawn in favour of "Haman" and crossed account payee only<br></br>
                                                            Bank:BOC<br></br>
                                                            Account Number : 93829087<br></br>
                                                            Account Name : Haman<br></br>
                                                            Branch Name : Wellewathe
                                                        </>
                                                    )}

                                                    {terra && (
                                                        <>
                                                            Payment mode : Cash or cheque. All cheques are to be drawn in favour of "Terra walkers" and crossed account payee only<br></br>
                                                            Bank:Sampath Bank<br></br>
                                                            Account Number : 0117 1000 1407<br></br>
                                                            Account Name : Terra walkers<br></br>
                                                            Branch Name : Kirulapona
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td>Subtotal</td>
                                        < td className='text-end'>{invoiceProducts.reduce((total, product) => total + Number(product.returnAmount), 0)}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>Discount</td>
                                        < td className='text-end'>
                                            {invoiceProducts.reduce(
                                                (total, product) => total + product.discount,
                                                0
                                            )}
                                        </td>
                                    </tr> */}
                                    <tr>
                                        <td>Other Charges</td>
                                        {Transaction.map((Transaction) => (
                                            < td className='text-end'></td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td>VAT</td>
                                        {Transaction.map((Transaction) => (
                                            < td className='text-end'></td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td>TOTAL</td>
                                        < td className='text-end'>{invoiceProducts.reduce((total, product) => total + Number(product.returnAmount), 0)}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="delivery-note mt-2">
                                <label htmlFor="" className='mt-2'>Note:</label>
                                {showNote && (
                                    <>
                                        {Transaction.map((Transaction) => (
                                            <textarea value={Transaction.note} name="note" rows={2} id="deliveryNote"></textarea>
                                        ))}
                                    </>
                                )}
                            </div>

                            <footer className="invoice-footer ">
                                {/* <p className='text-danger font-weight-bold'>Payment mode :  Cash or cheque. All cheques are to be drawn in favour of "Colkan" and crossed account payee only.</p>
                                 */}
                                <div className="signature">
                                    <table className="signature-table">
                                        <thead>
                                            <tr>
                                                <th>Prepared by</th>
                                                <th>Issued by</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </footer>
                        </div>
                    </div>

                    <div className="options">
                        <div className="invoice-type">
                            <form action="">
                                <br />
                                <label className='invoice-type-label' htmlFor="">Address</label>
                                <input type="checkbox" checked={showAddress} onChange={() => handleCheckboxChange('address')} disabled id='disabled' />
                                <br />
                                <label className='invoice-type-label' htmlFor="">Bank</label>
                                <input type="checkbox" checked={showBank} onChange={() => handleCheckboxChange('bank')} disabled id='disabled' />

                                <br />
                                <label className='invoice-type-label' htmlFor="">Phone</label>
                                <input type="checkbox" checked={showPhone} onChange={() => handleCheckboxChange('phone')} disabled id='disabled' />
                                <br />
                                <label className='invoice-type-label' htmlFor="">Email</label>
                                <input type="checkbox" checked={showEmail} onChange={() => handleCheckboxChange('email')} disabled id='disabled' />
                            </form>
                        </div>
                        <Link to='/return/list'><button className='btn btn-danger'>Cancel</button></Link>
                        <button onClick={handlePrint} className='btn btn-success'>Print</button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CreditNote;
