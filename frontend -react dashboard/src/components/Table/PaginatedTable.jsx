// import { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import DatePicker from "react-datepicker";
// import { isValid, format } from "date-fns";
// import "react-datepicker/dist/react-datepicker.css";
// import "./Table.css";

// const PaginatedTable = ({
//     data,
//     title,
//     invoice,
//     columns,
//     onAdd,
//     btnName,
//     onEdit,
//     onDelete,
//     onRowClick,
//     showSearch = true,
//     showButton = true,
//     showActions = true,
//     showEdit = true,
//     showDelete = true,
//     showRow = true,
//     showPDF = true,
//     showDate = true,
// }) => {
//     const [tableData, setTableData] = useState(data);
//     const [tableColumns, setTableColumns] = useState(columns);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const itemsPerPage = 10;

//     useEffect(() => {
//         setTableData(Array.isArray(data) ? data : []);
//     }, [data]);

//     useEffect(() => {
//         setTableColumns(columns);
//     }, [columns]);

//     // Filter data based on search and date range
//     const filteredData = tableData.filter((tableDatum) => {
//         const query = searchQuery.toLowerCase();
//         const tableDate = tableDatum[2] ? new Date(tableDatum[2]) : null;
//         const formattedTableDate = isValid(tableDate)
//             ? format(tableDate, "yyyy-MM-dd")
//             : null;

//         const matchesQuery = tableDatum.some((item) =>
//             item != null && item.toString().toLowerCase().includes(query)
//         );

//         const matchesDateRange =
//             (!startDate || !endDate ||
//                 (formattedTableDate >= format(startDate, "yyyy-MM-dd") &&
//                     formattedTableDate <= format(endDate, "yyyy-MM-dd")));

//         return matchesQuery && matchesDateRange;
//     });

//     // Calculate pagination details
//     const totalItems = filteredData.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     // Get paginated data in descending order
//     const getPaginatedData = () => {
//         const reversedData = [...filteredData].reverse();
//         const lastPageItems = totalItems % itemsPerPage || itemsPerPage;
        
//         let startIndex, endIndex;
        
//         if (currentPage === 1) {
//             // First page shows the last complete set of 10 items
//             const remainingItems = totalItems % itemsPerPage;
//             const firstPageStart = Math.max(0, totalItems - remainingItems - itemsPerPage);
//             startIndex = firstPageStart;
//             endIndex = firstPageStart + itemsPerPage;
//         } else {
//             // For other pages, calculate backwards from the end
//             const itemsBeforeCurrentPage = (totalPages - currentPage + 1) * itemsPerPage;
//             startIndex = Math.max(0, totalItems - itemsBeforeCurrentPage);
//             endIndex = startIndex + itemsPerPage;
//         }
        
//         return reversedData.slice(startIndex, endIndex);
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const generatePDF = () => {
//         const doc = new jsPDF();
//         doc.text(title, 20, 20);

//         const headers = columns.map((column) => ({
//             content: column,
//             styles: { halign: "center" },
//         }));
//         const tableData = filteredData.map((row) =>
//             row.map((cell) => ({ content: cell, styles: { halign: "center" } }))
//         );

//         doc.autoTable({
//             head: [headers],
//             body: tableData,
//             startY: 30,
//             theme: "striped",
//             margin: { top: 10, right: 10, bottom: 10, left: 10 },
//             styles: { fontSize: 5, halign: "center", valign: "middle" },
//             headStyles: { fillColor: [255, 216, 126], textColor: 0, fontSize: 5 },
//             bodyStyles: { textColor: 50 },
//             alternateRowStyles: { fillColor: [250, 250, 250] },
//         });

//         doc.save(invoice);
//     };

//     const resetFilters = () => {
//         setStartDate(null);
//         setEndDate(null);
//     };

//     return (
//         <div>
//             <div className="container-fluid p-2">
//             <div className="flex-t-h">
//                     {showSearch && (
//                         <div className="mb-2 me-2">
//                             <input
//                                 type="text"
//                                 className="form-control form-con"
//                                 placeholder="Search"
//                                 value={searchQuery}
//                                 onChange={(e) => {
//                                     setSearchQuery(e.target.value);
//                                     setCurrentPage(1);
//                                 }}
//                                 style={{ fontSize: "12px" }}
//                             />
//                         </div>
//                     )}

//                     {showRow && (
//                         <div className="mb-2 me-2" style={{ fontSize: "12px" }}>
                            
//                         </div>
//                     )}

//                     <div className="d-flex ms-auto flex-se">
//                         {showDate && (
//                             <div className="d-flex me-2 date">
//                                 <div className="mb-2 me-2 " style={{ fontSize: "10px" }}>
//                                     <DatePicker
//                                         selectsRange
//                                         startDate={startDate}
//                                         endDate={endDate}
//                                         onChange={(update) => {
//                                             setStartDate(update[0]);
//                                             setEndDate(update[1]);
//                                         }}
//                                         placeholderText="Select Date Range"
//                                         className="form-control"
//                                         dateFormat="yyyy-MM-dd"
//                                         style={{ fontSize: "10px" }}
//                                     />
//                                 </div>
//                                 <div>
//                                     <button className="btn btn-danger" onClick={resetFilters} style={{ fontSize: "10px" }}>
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
//                                             <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {showPDF && (
//                             <div className="me-2">
//                                 <button
//                                     className="btn btn-secondary btn-sm"
//                                     onClick={generatePDF}
//                                     style={{ fontSize: "12px" }}
//                                 >
//                                     Generate PDF
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {showButton && (
//                     <div className="d-flex justify-content-end">
//                         <button className="btn btn-warning text-dark" onClick={onAdd} style={{ fontSize: "12px" }}>
//                             {btnName}
//                         </button>
//                     </div>
//                 )}

//                 <div className="mt-2">
//                     <div className="table-table" style={{ borderRadius: "5px" }}>
//                         <table className="table table-primary table-hover table-bordered table-responsive table-striped">
//                             <thead>
//                                 <tr>
//                                     {tableColumns.map((item, index) => (
//                                         <th key={index}>{item}</th>
//                                     ))}
//                                     {showActions && <th>Actions</th>}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {getPaginatedData().map((datum, rowIndex) => (
//                                     <tr
//                                         key={rowIndex}
//                                         onClick={() => showRow && onRowClick && onRowClick(datum)}
//                                         style={{ cursor: showRow ? 'pointer' : 'default' }}
//                                     >
//                                         {datum.map((item, colIndex) => (
//                                             <td
//                                                 key={colIndex}
//                                                 style={{
//                                                     textAlign: "center",
//                                                     fontSize: "13px",
//                                                     fontWeight: "500"
//                                                 }}
//                                             >
//                                                 {item}
//                                             </td>
//                                         ))}
//                                         {showActions && (
//                                             <td style={{ textAlign: "center" }}>
//                                                 {showEdit && (
//                                                     <button
//                                                         className="btn btn-warning btn-sm mr-3"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             onEdit(rowIndex);
//                                                         }}
//                                                         style={{ fontSize: "10px" }}
//                                                     >
//                                                         <FontAwesomeIcon icon={faPen} />
//                                                     </button>
//                                                 )}{" "}
//                                                 {showDelete && (
//                                                     <button
//                                                         className="btn btn-danger btn-sm"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             onDelete(rowIndex);
//                                                         }}
//                                                         style={{ fontSize: "10px" }}
//                                                     >
//                                                         <FontAwesomeIcon icon={faTrash} />
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         )}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {totalPages > 1 && (
//                     <nav aria-label="Table navigation" className="mt-3">
//                         <ul className="pagination justify-content-center">
//                             <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                                 <button
//                                     className="page-link"
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     disabled={currentPage === 1}
//                                     aria-label="Previous"
//                                 >
//                                     <span aria-hidden="true">&laquo;</span>
//                                     <span className="sr-only"></span>
//                                 </button>
//                             </li>
                            
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <li
//                                     key={index + 1}
//                                     className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
//                                 >
//                                     <button
//                                         className="page-link"
//                                         onClick={() => handlePageChange(index + 1)}
//                                         aria-current={currentPage === index + 1 ? "page" : undefined}
//                                     >
//                                         {index + 1}
//                                         {currentPage === index + 1 && (
//                                             <span className="sr-only"> </span>
//                                         )}
//                                     </button>
//                                 </li>
//                             ))}

//                             <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                                 <button
//                                     className="page-link"
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     disabled={currentPage === totalPages}
//                                     aria-label="Next"
//                                 >
//                                     <span aria-hidden="true">&raquo;</span>
//                                     <span className="sr-only"></span>
//                                 </button>
//                             </li>
//                         </ul>
//                     </nav>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PaginatedTable;




//---------------------------------------------------------------------------------------------------------

// import { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import DatePicker from "react-datepicker";
// import { isValid, parseISO, format } from "date-fns";
// import "react-datepicker/dist/react-datepicker.css";
// import "./Table.css";

// const PaginatedTable = ({
//     data,
//     title,
//     invoice,
//     columns,
//     onAdd,
//     btnName,
//     onEdit,
//     onDelete,
//     onRowClick,
//     showSearch = true,
//     showButton = true,
//     showActions = true,
//     showEdit = true,
//     showDelete = true,
//     showRow = true,
//     showPDF = true,
//     showDate = true,
// }) => {
//     const [tableData, setTableData] = useState(data);
//     const [tableColumns, setTableColumns] = useState(columns);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const itemsPerPage = 10;

//     useEffect(() => {
//         setTableData(Array.isArray(data) ? data : []);
//     }, [data]);

//     useEffect(() => {
//         setTableColumns(columns);
//     }, [columns]);

//     // Filter data based on search and date range
//     const filteredData = tableData.filter((row) => {
//         // Search filter
//         const searchMatch = !searchQuery || row.some(cell => 
//             cell && cell.toString().toLowerCase().includes(searchQuery.toLowerCase())
//         );

//         // Date filter
//         let dateMatch = true;
//         if (startDate && endDate && row[1]) { // Assuming date is in column index 1
//             try {
//                 const rowDate = new Date(row[1]);
//                 dateMatch = rowDate >= startDate && rowDate <= endDate;
//             } catch (error) {
//                 console.error("Date parsing error:", error);
//                 dateMatch = false;
//             }
//         }

//         return searchMatch && dateMatch;
//     });

//     // Calculate pagination details
//     const totalItems = filteredData.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     // Get current page data
//     const getCurrentPageData = () => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         return filteredData.slice(startIndex, startIndex + itemsPerPage);
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const generatePDF = () => {
//         const doc = new jsPDF();
//         doc.text(title, 20, 20);

//         const headers = columns.map((column) => ({
//             content: column,
//             styles: { halign: "center" },
//         }));
//         const tableData = filteredData.map((row) =>
//             row.map((cell) => ({ content: cell, styles: { halign: "center" } }))
//         );

//         doc.autoTable({
//             head: [headers],
//             body: tableData,
//             startY: 30,
//             theme: "striped",
//             margin: { top: 10, right: 10, bottom: 10, left: 10 },
//             styles: { fontSize: 5, halign: "center", valign: "middle" },
//             headStyles: { fillColor: [255, 193, 7], textColor: 0, fontSize: 5 }, // Changed to warning color
//             bodyStyles: { textColor: 50 },
//             alternateRowStyles: { fillColor: [250, 250, 250] },
//         });

//         doc.save(invoice);
//     };

//     const handleDateRangeChange = (dates) => {
//         const [start, end] = dates;
//         setStartDate(start);
//         setEndDate(end);
//         setCurrentPage(1); // Reset to first page when date filter changes
//     };

//     const resetFilters = () => {
//         setStartDate(null);
//         setEndDate(null);
//         setSearchQuery("");
//         setCurrentPage(1);
//     };

//     return (
//         <div>
//             <div className="container-fluid p-2">
//                 <div className="flex-t-h">
//                     {showSearch && (
//                         <div className="mb-2 me-2">
//                             <input
//                                 type="text"
//                                 className="form-control form-con"
//                                 placeholder="Search"
//                                 value={searchQuery}
//                                 onChange={(e) => {
//                                     setSearchQuery(e.target.value);
//                                     setCurrentPage(1);
//                                 }}
//                                 style={{ fontSize: "12px" }}
//                             />
//                         </div>
//                     )}

//                     <div className="d-flex ms-auto flex-se">
//                         {showDate && (
//                             <div className="d-flex me-2 date">
//                                 <div className="mb-2 me-2" style={{ fontSize: "10px" }}>
//                                     <DatePicker
//                                         selectsRange
//                                         startDate={startDate}
//                                         endDate={endDate}
//                                         onChange={handleDateRangeChange}
//                                         placeholderText="Select Date Range"
//                                         className="form-control"
//                                         dateFormat="yyyy-MM-dd"
//                                         style={{ fontSize: "10px" }}
//                                     />
//                                 </div>
//                                 <div>
//                                     <button 
//                                         className="btn btn-danger" 
//                                         onClick={resetFilters} 
//                                         style={{ fontSize: "10px" }}
//                                     >
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
//                                             <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {showPDF && (
//                             <div className="me-2">
//                                 <button
//                                     className="btn btn-warning btn-sm"
//                                     onClick={generatePDF}
//                                     style={{ fontSize: "12px" }}
//                                 >
//                                     Generate PDF
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {showButton && (
//                     <div className="d-flex justify-content-end">
//                         <button 
//                             className="btn btn-warning text-dark" 
//                             onClick={onAdd} 
//                             style={{ fontSize: "12px" }}
//                         >
//                             {btnName}
//                         </button>
//                     </div>
//                 )}

//                 <div className="mt-2">
//                     <div className="table-table" style={{ borderRadius: "5px" }}>
//                         <table className="table table-primary table-hover table-bordered table-responsive table-striped">
//                             <thead>
//                                 <tr>
//                                     {tableColumns.map((item, index) => (
//                                         <th key={index}>{item}</th>
//                                     ))}
//                                     {showActions && <th>Actions</th>}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {getCurrentPageData().map((datum, rowIndex) => (
//                                     <tr
//                                         key={rowIndex}
//                                         onClick={() => showRow && onRowClick && onRowClick(datum)}
//                                         style={{ cursor: showRow ? 'pointer' : 'default' }}
//                                     >
//                                         {datum.map((item, colIndex) => (
//                                             <td
//                                                 key={colIndex}
//                                                 style={{
//                                                     textAlign: "center",
//                                                     fontSize: "13px",
//                                                     fontWeight: "500"
//                                                 }}
//                                             >
//                                                 {item}
//                                             </td>
//                                         ))}
//                                         {showActions && (
//                                             <td style={{ textAlign: "center" }}>
//                                                 {showEdit && (
//                                                     <button
//                                                         className="btn btn-warning btn-sm me-2"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             onEdit(rowIndex);
//                                                         }}
//                                                         style={{ fontSize: "10px" }}
//                                                     >
//                                                         <FontAwesomeIcon icon={faPen} />
//                                                     </button>
//                                                 )}
//                                                 {showDelete && (
//                                                     <button
//                                                         className="btn btn-danger btn-sm"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             onDelete(rowIndex);
//                                                         }}
//                                                         style={{ fontSize: "10px" }}
//                                                     >
//                                                         <FontAwesomeIcon icon={faTrash} />
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         )}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {totalPages > 1 && (
//                     <nav aria-label="Table navigation" className="mt-3">
//                         <ul className="pagination justify-content-center">
//                             <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                                 <button
//                                     className="page-link"
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     disabled={currentPage === 1}
//                                 >
//                                     &laquo;
//                                 </button>
//                             </li>
                            
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <li
//                                     key={index + 1}
//                                     className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
//                                 >
//                                     <button
//                                         className="page-link"
//                                         onClick={() => handlePageChange(index + 1)}
//                                     >
//                                         {index + 1}
//                                     </button>
//                                 </li>
//                             ))}

//                             <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                                 <button
//                                     className="page-link"
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     disabled={currentPage === totalPages}
//                                 >
//                                     &raquo;
//                                 </button>
//                             </li>
//                         </ul>
//                     </nav>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PaginatedTable;





























// import { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import DatePicker from "react-datepicker";
// import { isValid, parse, format } from "date-fns";
// import "react-datepicker/dist/react-datepicker.css";
// import "./Table.css";

// const PaginatedTable = ({
//     data,
//     title,
//     invoice,
//     columns,
//     onAdd,
//     btnName,
//     onEdit,
//     onDelete,
//     onRowClick,
//     showSearch = true,
//     showButton = true,
//     showActions = true,
//     showEdit = true,
//     showDelete = true,
//     showRow = true,
//     showPDF = true,
//     showDate = true,
// }) => {
//     const [tableData, setTableData] = useState([]);
//     const [tableColumns, setTableColumns] = useState(columns);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const itemsPerPage = 10;

//     useEffect(() => {
//         // Sort data in descending order when it's initially set
//         const sortedData = Array.isArray(data) 
//             ? [...data].sort((a, b) => {
//                 // Assuming the date is in the second column (index 1)
//                 // const dateA = new Date(a[1]);
//                 // const dateB = new Date(b[1]);
//                 // return dateB - dateA;
//                 const indexA = parseInt(a[0], 10); // Convert to number
//             const indexB = parseInt(b[0], 10); // Convert to number
//             return indexB - indexA;
//               })
//             : [];
//         setTableData(sortedData);
//     }, [data]);

//     useEffect(() => {
//         setTableColumns(columns);
//     }, [columns]);

//     // Improved search function
//     const matchesSearchQuery = (item, query) => {
//         if (item == null) return false;
//         return item.toString().toLowerCase().includes(query.toLowerCase());
//     };

//     // Filter data based on search and date range
//     const filteredData = tableData.filter((row) => {
//         // Search functionality
//         const searchMatches = searchQuery === "" || 
//             row.some(item => matchesSearchQuery(item, searchQuery));

//         // Date filtering
//         let dateMatches = true;
//         if (startDate && endDate && row[1]) { // Assuming date is in second column
//             const rowDate = new Date(row[1]);
//             dateMatches = rowDate >= startDate && rowDate <= endDate;
//         }

//         return searchMatches && dateMatches;
//     });

//     // Calculate pagination details
//     const totalItems = filteredData.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     // Get paginated data
//     const getPaginatedData = () => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         return filteredData.slice(startIndex, endIndex);
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const generatePDF = () => {
//         const doc = new jsPDF();
//         doc.text(title, 20, 20);

//         const headers = columns.map((column) => ({
//             content: column,
//             styles: { halign: "center" },
//         }));
//         const tableData = filteredData.map((row) =>
//             row.map((cell) => ({ content: cell, styles: { halign: "center" } }))
//         );

//         doc.autoTable({
//             head: [headers],
//             body: tableData,
//             startY: 30,
//             theme: "striped",
//             margin: { top: 10, right: 10, bottom: 10, left: 10 },
//             styles: { fontSize: 5, halign: "center", valign: "middle" },
//             headStyles: { fillColor: [255, 193, 7], textColor: 0, fontSize: 5 }, // Changed to warning color
//             bodyStyles: { textColor: 50 },
//             alternateRowStyles: { fillColor: [250, 250, 250] },
//         });

//         doc.save(invoice);
//     };

//     const resetFilters = () => {
//         setStartDate(null);
//         setEndDate(null);
//         setSearchQuery("");
//         setCurrentPage(1);
//     };

//     const handleDateRangeChange = (dates) => {
//         const [start, end] = dates;
//         setStartDate(start);
//         setEndDate(end);
//         setCurrentPage(1);
//     };

//     return (
//         <div>
//             <div className="container-fluid p-2">
//                 <div className="flex-t-h">
//                     {showSearch && (
//                         <div className="mb-2 me-2">
//                             <input
//                                 type="text"
//                                 className="form-control form-con"
//                                 placeholder="Search..."
//                                 value={searchQuery}
//                                 onChange={(e) => {
//                                     setSearchQuery(e.target.value);
//                                     setCurrentPage(1);
//                                 }}
//                                 style={{ fontSize: "12px" }}
//                             />
//                         </div>
//                     )}

//                     <div className="d-flex ms-auto flex-se">
//                         {showDate && (
//                             <div className="d-flex me-2 date">
//                                 <div className="mb-2 me-2" style={{ fontSize: "10px" }}>
//                                     <DatePicker
//                                         selectsRange
//                                         startDate={startDate}
//                                         endDate={endDate}
//                                         onChange={handleDateRangeChange}
//                                         placeholderText="Select Date Range"
//                                         className="form-control"
//                                         dateFormat="yyyy-MM-dd"
//                                         style={{ fontSize: "10px" }}
//                                     />
//                                 </div>
//                                 <div>
//                                     <button 
//                                         className="btn btn-danger" 
//                                         onClick={resetFilters} 
//                                         style={{ fontSize: "10px" }}
//                                     >
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
//                                             <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {showPDF && (
//                             <div className="me-2">
//                                 <button
//                                     className="btn btn-warning btn-sm"
//                                     onClick={generatePDF}
//                                     style={{ fontSize: "12px" }}
//                                 >
//                                     Generate PDF
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {showButton && (
//                     <div className="d-flex justify-content-end">
//                         <button 
//                             className="btn btn-warning text-dark" 
//                             onClick={onAdd} 
//                             style={{ fontSize: "12px" }}
//                         >
//                             {btnName}
//                         </button>
//                     </div>
//                 )}

//                 <div className="mt-2">
//                     <div className="table-table" style={{ borderRadius: "5px" }}>
//                         <table className="table table-hover table-bordered table-responsive table-striped">
//                             <thead className="table-dark">
//                                 <tr>
//                                     {tableColumns.map((item, index) => (
//                                         <th key={index}>{item}</th>
//                                     ))}
//                                     {showActions && <th>Actions</th>}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {getPaginatedData().map((datum, rowIndex) => (
//                                     <tr
//                                         key={rowIndex}
//                                         onClick={() => showRow && onRowClick && onRowClick(datum)}
//                                         style={{ cursor: showRow ? 'pointer' : 'default' }}
//                                     >
//                                         {datum.map((item, colIndex) => (
//                                             <td
//                                                 key={colIndex}
//                                                 style={{
//                                                     textAlign: "center",
//                                                     fontSize: "13px",
//                                                     fontWeight: "500"
//                                                 }}
//                                             >
//                                                 {item}
//                                             </td>
//                                         ))}
//                                         {showActions && (
//                                             <td style={{ textAlign: "center" }}>
//                                                 {showEdit && (
//                                                     <button
//                                                         className="btn btn-warning btn-sm me-2"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             onEdit(datum);
//                                                         }}
//                                                         style={{ fontSize: "10px" }}
//                                                     >
//                                                         <FontAwesomeIcon icon={faPen} />
//                                                     </button>
//                                                 )}
//                                                {showDelete && (
//                                                     <button
//                                                         className="btn btn-danger btn-sm"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation(); // Prevent triggering onRowClick
//                                                             onDelete(rowIndex);
//                                                         }}
//                                                         style={{ fontSize: "10px" }}
//                                                     >
//                                                         <FontAwesomeIcon icon={faTrash} />
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         )}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {totalPages > 1 && (
//                     <nav aria-label="Table navigation" className="mt-3">
//                         <ul className="pagination justify-content-center">
//                             <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                                 <button
//                                     className="page-link"
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     disabled={currentPage === 1}
//                                 >
//                                     &laquo;
//                                 </button>
//                             </li>
                            
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <li
//                                     key={index + 1}
//                                     className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
//                                 >
//                                     <button
//                                         className="page-link"
//                                         onClick={() => handlePageChange(index + 1)}
//                                     >
//                                         {index + 1}
//                                     </button>
//                                 </li>
//                             ))}

//                             <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                                 <button
//                                     className="page-link"
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     disabled={currentPage === totalPages}
//                                 >
//                                     &raquo;
//                                 </button>
//                             </li>
//                         </ul>
//                     </nav>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PaginatedTable;





















import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";
import { isValid, parse, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./Table.css";

const PaginatedTable = ({
    data,
    title,
    invoice,
    columns,
    onAdd,
    btnName,
    onEdit,
    onDelete,
    onRowClick,
    showSearch = true,
    showButton = true,
    showActions = true,
    showEdit = true,
    showDelete = true,
    showRow = true,
    showPDF = true,
    showDate = true,
}) => {
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState(columns);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        // Sort data in descending order when it's initially set
        const sortedData = Array.isArray(data) 
            ? [...data].sort((a, b) => {
                // Assuming the date is in the second column (index 1)
                // const dateA = new Date(a[1]);
                // const dateB = new Date(b[1]);
                // return dateB - dateA;
                const indexA = parseInt(a[0], 10); // Convert to number
            const indexB = parseInt(b[0], 10); // Convert to number
            return indexB - indexA;
              })
            : [];
        setTableData(sortedData);
    }, [data]);

    useEffect(() => {
        setTableColumns(columns);
    }, [columns]);

    // Improved search function
    const matchesSearchQuery = (item, query) => {
        if (item == null) return false;
        return item.toString().toLowerCase().includes(query.toLowerCase());
    };

    // Filter data based on search and date range
    const filteredData = tableData.filter((row) => {
        // Search functionality
        const searchMatches = searchQuery === "" || 
            row.some(item => matchesSearchQuery(item, searchQuery));

        // Date filtering
        let dateMatches = true;
        if (startDate && endDate && row[1]) { // Assuming date is in second column
            const rowDate = new Date(row[1]);
            dateMatches = rowDate >= startDate && rowDate <= endDate;
        }

        return searchMatches && dateMatches;
    });

    // Calculate pagination details
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get paginated data
    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text(title, 20, 20);

        const headers = columns.map((column) => ({
            content: column,
            styles: { halign: "center" },
        }));
        const tableData = filteredData.map((row) =>
            row.map((cell) => ({ content: cell, styles: { halign: "center" } }))
        );

        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 30,
            theme: "striped",
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            styles: { fontSize: 5, halign: "center", valign: "middle" },
            headStyles: { fillColor: [255, 193, 7], textColor: 0, fontSize: 5 }, // Changed to warning color
            bodyStyles: { textColor: 50 },
            alternateRowStyles: { fillColor: [250, 250, 250] },
        });

        doc.save(invoice);
    };

    const resetFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setSearchQuery("");
        setCurrentPage(1);
    };

    const handleDateRangeChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="container-fluid p-2">
                <div className="flex-t-h">
                    {showSearch && (
                        <div className="mb-2 me-2">
                            <input
                                type="text"
                                className="form-control form-con"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                style={{ fontSize: "12px" }}
                            />
                        </div>
                    )}

                    <div className="d-flex ms-auto flex-se">
                        {showDate && (
                            <div className="d-flex me-2 date">
                                <div className="mb-2 me-2" style={{ fontSize: "10px" }}>
                                    <DatePicker
                                        selectsRange
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={handleDateRangeChange}
                                        placeholderText="Select Date Range"
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                        style={{ fontSize: "10px" }}
                                    />
                                </div>
                                <div>
                                    <button 
                                        className="btn btn-danger" 
                                        onClick={resetFilters} 
                                        style={{ fontSize: "10px" }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {showPDF && (
                            <div className="me-2">
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={generatePDF}
                                    style={{ fontSize: "12px" }}
                                >
                                    Generate PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showButton && (
                    <div className="d-flex justify-content-end">
                        <button 
                            className="btn btn-warning text-dark" 
                            onClick={onAdd} 
                            style={{ fontSize: "12px" }}
                        >
                            {btnName}
                        </button>
                    </div>
                )}

                <div className="mt-2">
                    <div className="table-table" style={{ borderRadius: "5px" }}>
                        <table className="table table-hover table-bordered table-responsive table-striped">
                            <thead className="table-dark">
                                <tr>
                                    {tableColumns.map((item, index) => (
                                        <th key={index}>{item}</th>
                                    ))}
                                    {showActions && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {getPaginatedData().map((datum, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        onClick={() => showRow && onRowClick && onRowClick(datum)}
                                        style={{ cursor: showRow ? 'pointer' : 'default' }}
                                    >
                                        {datum.map((item, colIndex) => (
                                            <td
                                                key={colIndex}
                                                style={{
                                                    textAlign: "center",
                                                    fontSize: "13px",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                {item}
                                            </td>
                                        ))}
                                        {showActions && (
                                            <td style={{ textAlign: "center" }}>
                                                {showEdit && (
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEdit(datum);
                                                        }}
                                                        style={{ fontSize: "10px" }}
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                )}
                                               {showDelete && (
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent triggering onRowClick
                                                            onDelete(rowIndex);
                                                        }}
                                                        style={{ fontSize: "10px" }}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {totalPages > 1 && (
                    <nav aria-label="Table navigation" className="mt-3">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &laquo;
                                </button>
                            </li>
                            
                            {[...Array(totalPages)].map((_, index) => (
                                <li
                                    key={index + 1}
                                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default PaginatedTable;