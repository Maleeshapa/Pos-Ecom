// import React, { useState } from 'react';
// import CostingModal from './CostingModal';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Trash } from 'lucide-react';
// import axios from 'axios';
// import config from '../../config';

// const CostingTable = () => {
//     const [entries, setEntries] = useState([]);
//     const [formData, setFormData] = useState({
        
//         descriptionCustomer: '',
//         productCode: '',
//         description: '',
//         warranty: '',
//         supplier: '',
//         unitCost: 0,
//         ourMarginPercentage: 0,
//         ourMarginValue: 0,
//         otherMarginPercentage: 0,
//         otherMarginValue: 0,
//         pricePlusMargin: 0,
//         sellingRate: 0,
//         sellingRateRounded: 0,
//         uom: '',
//         qty: 1,
//         unitPrice: 0,
//         discountPercentage: 0,
//         discountValue: 0,
//         discountedPrice: 0,
//         amount: 0,
//         profit: 0,
//     });
//     const [showModal, setShowModal] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);

//     const handleInputChange = (updatedData) => {
//         setFormData(updatedData);
//     };

//     const handleSubmit = () => {
//         if (formData.unitCost > 0 && formData.qty > 0) {
//             setEntries([...entries, formData]);
//             resetForm();
//         } else {
//             alert('Please fill in all the fields correctly.');
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             descriptionCustomer: '',
//             productCode: '',
//             description: '',
//             warranty: '',
//             supplier: '',
//             unitCost: 0,
//             ourMarginPercentage: 0,
//             ourMarginValue: 0,
//             otherMarginPercentage: 0,
//             otherMarginValue: 0,
//             pricePlusMargin: 0,
//             sellingRate: 0,
//             sellingRateRounded: 0,
//             uom: '',
//             qty: 1,
//             unitPrice: 0,
//             discountPercentage: 0,
//             discountValue: 0,
//             discountedPrice: 0,
//             amount: 0,
//             profit: 0,
//         });
//     };

//     const handleDelete = (index) => {
//         setEntries(entries.filter((_, i) => i !== index));
//     };

//     const calculateTotals = () => {
//         return entries.reduce((acc, entry) => ({
//             totalAmount: acc.totalAmount + parseFloat(entry.amount),
//             totalProfit: acc.totalProfit + parseFloat(entry.profit)
//         }), { totalAmount: 0, totalProfit: 0 });
//     };

//     // const handleSaveToDatabase = async () => {
//     //     if (entries.length === 0) {
//     //         alert('Please add at least one entry');
//     //         return;
//     //     }

//     //     setIsSaving(true);
//     //     const totals = calculateTotals();

//     //     try {
//     //         // Save header first
//     //         const headerResponse = await axios.post(`${config.BASE_URL}/costing/header`, {
//     //             totalAmount: totals.totalAmount,
//     //             totalProfit: totals.totalProfit
//     //         });

//     //         const headerId = headerResponse.data.id;

//     //         // Save details
//     //         const detailsPromises = entries.map(entry => 
//     //             axios.post(`${config.BASE_URL}/costing/detail`, {
//     //                 headerId,
//     //                 productCode: entry.productCode,
//     //                 descriptionCustomer: entry.descriptionCustomer,
//     //                 description: entry.description,
//     //                 warranty: entry.warranty,
//     //                 supplier: entry.supplier,
//     //                 unitCost: entry.unitCost,
//     //                 ourMarginPercentage: entry.ourMarginPercentage,
//     //                 ourMarginValue: entry.ourMarginValue,
//     //                 otherMarginPercentage: entry.otherMarginPercentage,
//     //                 otherMarginValue: entry.otherMarginValue,
//     //                 pricePlusMargin: entry.pricePlusMargin,
//     //                 sellingRate: entry.sellingRate,
//     //                 sellingRateRounded: entry.sellingRateRounded,
//     //                 uom: entry.uom,
//     //                 qty: entry.qty,
//     //                 unitPrice: entry.unitPrice,
//     //                 discountPercentage: entry.discountPercentage,
//     //                 discountValue: entry.discountValue,
//     //                 discountedPrice: entry.discountedPrice,
//     //                 amount: entry.amount,
//     //                 profit: entry.profit
//     //             })
//     //         );

//     //         await Promise.all(detailsPromises);
//     //         alert('Costing data saved successfully');
//     //         setEntries([]);
//     //     } catch (error) {
//     //         console.error('Error saving costing data:', error);
//     //         alert('Error saving costing data');
//     //     } finally {
//     //         setIsSaving(false);
//     //     }
//     // };

//     const handleSaveToDatabase = async () => {
//         if (entries.length === 0) {
//             alert('Please add at least one entry');
//             return;
//         }
    
//         setIsSaving(true);
//         const totals = calculateTotals();
    
//         try {
//             const response = await axios.post(`${config.BASE_URL}/costing`, {
//                 headerData: {
//                     cusId: entries[0].cusId, // Pass the cusId from the first entry
//                     totalAmount: totals.totalAmount,
//                     totalProfit: totals.totalProfit,
//                     status: 'draft',
//                 },
//                 detailsData: entries,
//             });
    
//             alert('Costing data saved successfully');
//             setEntries([]);
//         } catch (error) {
//             console.error('Error saving costing data:', error);
//             alert('Error saving costing data');
//         } finally {
//             setIsSaving(false);
//         }
//     };
    
//     return (
//         <div className="container-fluid mt-4">
//             <div className="d-flex justify-content-between mb-3">
//                 <button
//                     className="btn btn-primary"
//                     onClick={() => setShowModal(true)}
//                 >
//                     + Add Entry
//                 </button>
                
//                 <button
//                     className="btn btn-success"
//                     onClick={handleSaveToDatabase}
//                     disabled={isSaving || entries.length === 0}
//                 >
//                     {isSaving ? 'Saving...' : 'Save to Database'}
//                 </button>
//             </div>

//             <table className="table table-bordered table-striped">
//             <thead>
//     <tr>
//         <th>Customer Name</th> {/* Add this line */}
//         <th className="table-warning">Customer Product Description</th>
//         <th>Product Code</th>
//         <th>Description</th>
//         <th>Warranty</th>
//         <th className="table-warning">Supplier</th>
//         <th className="table-warning">Unit Cost</th>
//         <th className="table-warning">Our Margin %</th>
//         <th className="table-warning">Our Margin Value</th>
//         <th className="table-warning">Other Margin %</th>
//         <th className="table-warning">Other Margin Value</th>
//         <th className="table-warning">Price + Margin</th>
//         <th className="table-warning">Selling Rate Before Discount</th>
//         <th className="table-warning">Selling Rate (Rounded to Nearest 10)</th>
//         <th>UOM</th>
//         <th>Qty</th>
//         <th>Unit Price</th>
//         <th>Discount %</th>
//         <th>Discount Value</th>
//         <th>Discounted Price</th>
//         <th>Amount</th>
//         <th className="table-warning">Profit</th>
//         <th>Action</th>
//     </tr>
// </thead>
// <tbody>
//     {entries.map((entry, index) => (
//         <tr key={index}>
//             <td>{entry.customerName}</td> {/* Add this line */}
//             {Object.entries(entry).map(([key, value], i) => {
//                 // Check if the key corresponds to a "table-warning" header
//                 const isWarningColumn = [
//                     'descriptionCustomer',
//                     'supplier',
//                     'unitCost',
//                     'ourMarginPercentage',
//                     'ourMarginValue',
//                     'otherMarginPercentage',
//                     'otherMarginValue',
//                     'pricePlusMargin',
//                     'sellingRate',
//                     'sellingRateRounded',
//                     'profit',
//                 ].includes(key);

//                 return (
//                     <td key={i} className={isWarningColumn ? 'table-warning' : ''}>
//                         {value}
//                     </td>
//                 );
//             })}
//             <td>
//                 <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(index)}
//                 >
//                     <Trash size={16} />
//                 </button>
//             </td>
//         </tr>
//     ))}
// </tbody>
//             </table>

//             <CostingModal
//     showModal={showModal}
//     closeModal={() => setShowModal(false)}
//     formData={formData}
//     onChange={(updatedData) => setFormData(updatedData)}
//     onSubmit={(newEntry) => {
//         setEntries([...entries, { ...newEntry, cusId: newEntry.cusId }]); // Ensure cusId is included
//         setFormData({
//             descriptionCustomer: '',
//             productCode: '',
//             description: '',
//             warranty: '',
//             supplier: '',
//             unitCost: 0,
//             ourMarginPercentage: 0,
//             ourMarginValue: 0,
//             otherMarginPercentage: 0,
//             otherMarginValue: 0,
//             pricePlusMargin: 0,
//             sellingRate: 0,
//             sellingRateRounded: 0,
//             uom: '',
//             qty: 1,
//             unitPrice: 0,
//             discountPercentage: 0,
//             discountValue: 0,
//             discountedPrice: 0,
//             amount: 0,
//             profit: 0,
//         });
//     }}
// />
//         </div>
//     );
// };

// export default CostingTable;


import React, { useState } from 'react';
import CostingModal from './CostingModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Trash } from 'lucide-react';
import axios from 'axios';
import config from '../../config';

const CostingTable = () => {
    const [entries, setEntries] = useState([]);
    const [formData, setFormData] = useState({
        descriptionCustomer: '',
        productCode: '',
        description: '',
        warranty: '',
        supplier: '',
        unitCost: 0,
        ourMarginPercentage: 0,
        ourMarginValue: 0,
        otherMarginPercentage: 0,
        otherMarginValue: 0,
        pricePlusMargin: 0,
        sellingRate: 0,
        sellingRateRounded: 0,
        uom: '',
        qty: 1,
        unitPrice: 0,
        discountPercentage: 0,
        discountValue: 0,
        discountedPrice: 0,
        amount: 0,
        profit: 0,
    });
    
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (updatedData) => {
        setFormData(updatedData);
    };

    const handleSubmit = () => {
        if (formData.unitCost > 0 && formData.qty > 0) {
            setEntries([...entries, { ...formData, needImage: false }]);
            resetForm();
        } else {
            alert('Please fill in all the fields correctly.');
        }
    };

    const resetForm = () => {
        setFormData({
            descriptionCustomer: '',
            productCode: '',
            description: '',
            warranty: '',
            supplier: '',
            unitCost: 0,
            ourMarginPercentage: 0,
            ourMarginValue: 0,
            otherMarginPercentage: 0,
            otherMarginValue: 0,
            pricePlusMargin: 0,
            sellingRate: 0,
            sellingRateRounded: 0,
            uom: '',
            qty: 1,
            unitPrice: 0,
            discountPercentage: 0,
            discountValue: 0,
            discountedPrice: 0,
            amount: 0,
            profit: 0,
        });
    };

    const handleDelete = (index) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    const calculateTotals = () => {
        return entries.reduce((acc, entry) => ({
            totalAmount: acc.totalAmount + parseFloat(entry.amount),
            totalProfit: acc.totalProfit + parseFloat(entry.profit)
        }), { totalAmount: 0, totalProfit: 0 });
    };


    const handleSaveToDatabase = async () => {
        if (entries.length === 0) {
            alert('Please add at least one entry');
            return;
        }
    
        setIsSaving(true);
        const totals = calculateTotals();
    
        try {
            const response = await axios.post(`${config.BASE_URL}/costing`, {
                headerData: {
                    cusId: entries[0].cusId, // Ensure cusId is included
                    totalAmount: totals.totalAmount,
                    totalProfit: totals.totalProfit,
                    status: 'draft',
                },
                detailsData: entries.map(entry => ({
                    ...entry,
                    needImage: entry.needImage || false, // Ensure needImage is included
                })),
            });
    
            alert('Costing data saved successfully');
            setEntries([]);
        } catch (error) {
            console.error('Error saving costing data:', error);
            alert('Error saving costing data');
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between mb-3">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    + Add Entry
                </button>
                
                <button
                    className="btn btn-success"
                    onClick={handleSaveToDatabase}
                    disabled={isSaving || entries.length === 0}
                >
                    {isSaving ? 'Saving...' : 'Save to Database'}
                </button>
            </div>

            <table className="table table-bordered table-striped">
            <thead>
    <tr>
        <th>Customer Name</th> 
        <th className="table-warning">Customer Product Description</th>
        <th>Product Code or Name</th>
        <th>Need Image</th> 
        <th>Description</th>
        <th>Warranty</th>
        <th className="table-warning">Supplier</th>
        <th className="table-warning">Unit Cost</th>
        <th className="table-warning">Our Margin %</th>
        <th className="table-warning">Our Margin Value</th>
        <th className="table-warning">Other Margin %</th>
        <th className="table-warning">Other Margin Value</th>
        <th className="table-warning">Price + Margin</th>
        <th className="table-warning">Selling Rate Before Discount</th>
        <th className="table-warning">Selling Rate (Rounded to Nearest 10)</th>
        <th>UOM</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Discount %</th>
        <th>Discount Value</th>
        <th>Discounted Price</th>
        <th>Amount</th>
        <th className="table-warning">Profit</th>
        <th>Action</th>
    </tr>
</thead>

<tbody>
    {entries.map((entry, index) => (
        <tr key={index}>
            <td>{entry.customerName}</td>
            <td>{entry.descriptionCustomer}</td>
            <td>{entry.productCode}</td>
            <td>
                <input
                    type="checkbox"
                    checked={entry.needImage || false}
                    onChange={(e) => {
                        const updatedEntries = [...entries];
                        updatedEntries[index].needImage = e.target.checked;
                        setEntries(updatedEntries);
                    }}
                />
            </td>
            <td>{entry.description}</td>
            <td>{entry.warranty}</td>
            <td>{entry.supplier}</td>
            <td>{entry.unitCost}</td>
            <td>{entry.ourMarginPercentage}</td>
            <td>{entry.ourMarginValue}</td>
            <td>{entry.otherMarginPercentage}</td>
            <td>{entry.otherMarginValue}</td>
            <td>{entry.pricePlusMargin}</td>
            <td>{entry.sellingRate}</td>
            <td>{entry.sellingRateRounded}</td>
            <td>{entry.uom}</td>
            <td>{entry.qty}</td>
            <td>{entry.unitPrice}</td>
            <td>{entry.discountPercentage}</td>
            <td>{entry.discountValue}</td>
            <td>{entry.discountedPrice}</td>
            <td>{entry.amount}</td>
            <td>{entry.profit}</td>
            <td>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(index)}
                >
                    <Trash size={16} />
                </button>
            </td>
        </tr>
    ))}
</tbody>

            </table>

            <CostingModal
    showModal={showModal}
    closeModal={() => setShowModal(false)}
    formData={formData}
    onChange={(updatedData) => setFormData(updatedData)}
    onSubmit={(newEntry) => {
        setEntries([...entries, { ...newEntry, cusId: newEntry.cusId }]); // Ensure cusId is included
        setFormData({
            descriptionCustomer: '',
            productCode: '',
            description: '',
            warranty: '',
            supplier: '',
            unitCost: 0,
            ourMarginPercentage: 0,
            ourMarginValue: 0,
            otherMarginPercentage: 0,
            otherMarginValue: 0,
            pricePlusMargin: 0,
            sellingRate: 0,
            sellingRateRounded: 0,
            uom: '',
            qty: 1,
            unitPrice: 0,
            discountPercentage: 0,
            discountValue: 0,
            discountedPrice: 0,
            amount: 0,
            profit: 0,
        });
    }}
/>
        </div>
    );
};

export default CostingTable;
