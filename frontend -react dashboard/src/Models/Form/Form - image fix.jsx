// import React, { useState, useEffect } from 'react';
// import config from '../../config';
// import { set } from 'date-fns';

// const Form = ({ closeModal, onSave, cus }) => {
//   const [formErrors, setFormErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     nic: '',
//     license: '',
//     jobPosition: '',
//     address: '',
//     customerReview: '',
//     customerDescription: '',
//     guarantorName: '',
//     guarantorNic: '',
//     nicFront: null,
//     nicBack: null,
//   });

//   useEffect(() => {
//     console.log("Editing customer:", cus);
//     if (cus) {
//       setFormData({
//         name: cus.cusName || '',
//         phone: cus.cusPhone || '',
//         nic: cus.nic || '',
//         license: cus.license || '',
//         jobPosition: cus.cusJob || '',
//         address: cus.cusAddress || '',
//         customerReview: typeof cus.customerReview === 'object' ?
//           (cus.customerReview.props?.children || '') :
//           (cus.customerReview || ''),
//         customerDescription: cus.customerDescription || '',
//       });
//       if (cus.nic) {
//         setImagePreviews({
//           nicFrontPreview: `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-front.jpg`,
//           nicBackPreview: `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-back.jpg`
//         });
//       }
//     }
//   }, [cus]);

//   const [imagePreviews, setImagePreviews] = useState({
//     nicFrontPreview: null,
//     nicBackPreview: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (formErrors[name]) {
//       setFormErrors({ ...formErrors, [name]: '' });
//     }
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     const file = files?.[0];

//     if (file) {
//       setFormData(prev => ({ ...prev, [name]: file }));

//       const imageURL = URL.createObjectURL(file);
//       setImagePreviews(prev => ({
//         ...prev,
//         [`${name}Preview`]: imageURL,
//       }));
//     }
//   };

//   const validate = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Name is required.';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required.';
//     }

//     if (!formData.address.trim()) {
//       errors.address = 'Address is required.';
//     }

//     return errors;
//   };

//   // const handleSubmitCus = async (e) => {
//   //   e.preventDefault();

//   //   const errors = validate();
//   //   if (Object.keys(errors).length > 0) {
//   //     setFormErrors(errors);
//   //     return;
//   //   }

//   //   try {

//   //     const hasFileUpdates = formData.nicFront instanceof File || formData.nicBack instanceof File;

//   //     let requestBody;
//   //     let headers = {};

//   //     if (cus && !hasFileUpdates) {
//   //       requestBody = JSON.stringify({
//   //         cusId: cus.cusId,
//   //         cusName: formData.name.trim(),
//   //         cusPhone: formData.phone.trim(),
//   //         cusAddress: formData.address.trim(),
//   //         cusJob: formData.jobPosition?.trim() || '',
//   //         nic: formData.nic?.trim() || '',
//   //         license: formData.license?.trim() || '',
//   //         customerReview: formData.customerReview || '',
//   //         customerDescription: formData.customerDescription?.trim() || '',
//   //       });
//   //       headers['Content-Type'] = 'application/json';
//   //     } else {

//   //       requestBody = new FormData();

//   //       requestBody.append('cusName', formData.name.trim());
//   //       requestBody.append('cusPhone', formData.phone.trim());
//   //       requestBody.append('cusAddress', formData.address.trim());

//   //       if (formData.jobPosition) {
//   //         requestBody.append('cusJob', formData.jobPosition.trim());
//   //       }

//   //       if (formData.nic) {
//   //         requestBody.append('nic', formData.nic.trim());
//   //       }

//   //       if (formData.license) {
//   //         requestBody.append('license', formData.license.trim());
//   //       }

//   //       if (formData.customerReview) {
//   //         requestBody.append('customerReview', formData.customerReview);
//   //       }

//   //       if (formData.customerDescription) {
//   //         requestBody.append('customerDescription', formData.customerDescription.trim());
//   //       }

//   //       if (formData.nicFront instanceof File) {
//   //         requestBody.append('nicFront', formData.nicFront);
//   //       }

//   //       if (formData.nicBack instanceof File) {
//   //         requestBody.append('nicBack', formData.nicBack);
//   //       }
//   //     }

//   //     const url = cus
//   //       ? `${config.BASE_URL}/customer/${cus.cusId}`
//   //       : `${config.BASE_URL}/customer`;
//   //     const method = cus ? 'PUT' : 'POST';

//   //     const response = await fetch(url, {
//   //       method,
//   //       headers,
//   //       body: requestBody,
//   //     });

//   //     const responseData = await response.json();

//   //     if (!response.ok) {
//   //       switch (response.status) {
//   //         case 400:
//   //           setError('Please check the provided data and try again.');
//   //           break;
//   //         case 409:
//   //           setError('A customer with this information already exists.');
//   //           break;
//   //         case 413:
//   //           setError('The uploaded files are too large. Please use smaller files.');
//   //           break;
//   //         default:
//   //           setError(responseData.error || 'An error occurred while saving the customer.');
//   //       }
//   //       return;
//   //     }

//   //     setError(cus ? 'Successfully Updated!' : 'Successfully Created!');

//   //     const updatedCustomer = cus ? {
//   //       ...cus,
//   //       cusName: formData.name,
//   //       cusPhone: formData.phone,
//   //       cusAddress: formData.address,
//   //       cusJob: formData.jobPosition,
//   //       nic: formData.nic,
//   //       license: formData.license,
//   //       customerReview: formData.customerReview,
//   //       customerDescription: formData.customerDescription,
//   //     } : responseData.newCustomer;

//   //     onSave(updatedCustomer);
//   //     closeModal();

//   //   } catch (error) {
//   //     console.error('Error submitting form:', error);
//   //     setError('An unexpected error occurred. Please try again later.');
//   //   }
//   // };

//   const handleSubmitCus = async (e) => {
//     e.preventDefault();

//     const errors = validate();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     try {
//       const hasFileUpdates = formData.nicFront instanceof File || formData.nicBack instanceof File;

//       let requestBody;
//       let headers = {};

//       if (cus && !hasFileUpdates) {
//         requestBody = JSON.stringify({
//           cusId: cus.cusId,
//           cusName: formData.name.trim(),
//           cusPhone: formData.phone.trim(),
//           cusAddress: formData.address.trim(),
//           cusJob: formData.jobPosition?.trim() || '',
//           nic: formData.nic?.trim() || '',
//           license: formData.license?.trim() || '',
//           customerReview: formData.customerReview || '',
//           customerDescription: formData.customerDescription?.trim() || '',
//         });
//         headers['Content-Type'] = 'application/json';
//       } else {
//         requestBody = new FormData();
//         requestBody.append('cusName', formData.name.trim());
//         requestBody.append('cusPhone', formData.phone.trim());
//         requestBody.append('cusAddress', formData.address.trim());

//         if (formData.jobPosition) {
//           requestBody.append('cusJob', formData.jobPosition.trim());
//         }

//         if (formData.nic) {
//           requestBody.append('nic', formData.nic.trim());
//         }

//         if (formData.license) {
//           requestBody.append('license', formData.license.trim());
//         }

//         if (formData.customerReview) {
//           requestBody.append('customerReview', formData.customerReview);
//         }

//         if (formData.customerDescription) {
//           requestBody.append('customerDescription', formData.customerDescription.trim());
//         }

//         if (formData.nicFront instanceof File) {
//           requestBody.append('nicFront', formData.nicFront);
//         }

//         if (formData.nicBack instanceof File) {
//           requestBody.append('nicBack', formData.nicBack);
//         }
//       }

//       const url = cus
//         ? `${config.BASE_URL}/customer/${cus.cusId}`
//         : `${config.BASE_URL}/customer`;
//       const method = cus ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers,
//         body: requestBody,
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         switch (response.status) {
//           case 400:
//             window.alert('Save Unsuccessful: Please check the provided data and try again.');
//             break;
//           case 409:
//             window.alert('Save Unsuccessful: A customer with this information already exists.');
//             break;
//           case 413:
//             window.alert('Save Unsuccessful: The uploaded files are too large. Please use smaller files.');
//             break;
//           default:
//             window.alert('Save Unsuccessful: An error occurred while saving the customer.');
//         }
//         return;
//       }

//       window.alert('Saved Successfully!');

//       const updatedCustomer = cus
//         ? {
//             ...cus,
//             cusName: formData.name,
//             cusPhone: formData.phone,
//             cusAddress: formData.address,
//             cusJob: formData.jobPosition,
//             nic: formData.nic,
//             license: formData.license,
//             customerReview: formData.customerReview,
//             customerDescription: formData.customerDescription,
//           }
//         : responseData.newCustomer;

//       onSave(updatedCustomer);
//       closeModal();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       window.alert('Save Unsuccessful: An unexpected error occurred. Please try again later.');
//     }
//   };

//   const [guarantorSuggestions, setGuarantorSuggestions] = useState([]);

//   const fetchGuarantorSuggestions = async (guarantorName) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName,
//     }));

//     if (!guarantorName.trim()) {
//       setGuarantorSuggestions([]);
//       return;
//     }

//     try {
//       const response = await fetch(`${config.BASE_URL}/guarantors/suggestions/${guarantorName}`);
//       const data = await response.json();

//       if (response.ok) {
//         setGuarantorSuggestions(data);
//       } else {
//         setGuarantorSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Error fetching guarantor suggestions', error);
//       setGuarantorSuggestions([]);
//     }
//   };

//   const selectGuarantor = (guarantor) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName: guarantor.guarantorName,
//       guarantorNic: guarantor.guarantorNic,
//     }));
//     setGuarantorSuggestions([]);
//   };

//   return (
//     <div style={{ placeItems: 'center' }}>
//       <h2>{cus ? 'Edit Customer' : 'New Customer'}</h2>
//       {error && <div className="error-message">{error}</div>}
//       <form onSubmit={handleSubmitCus} autoComplete='off'>
//         <div>
//           <div className="row mt-2">
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="name">Name <span>*</span></label>
//               <input
//                 id="name"
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter Full Name"
//                 className="form-control"
//                 required
//                 aria-describedby={formErrors.name ? 'name-error' : undefined}
//               />
//               {formErrors.name && <span id="name-error" className="error-text">{formErrors.name}</span>}
//             </div>

//             <div className="col-md-6">
//               <label className="form-label" htmlFor="phone">Phone <span>*</span></label>
//               <input
//                 id="phone"
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="Enter Phone"
//                 required
//                 aria-describedby={formErrors.phone ? 'phone-error' : undefined}
//               />
//               {formErrors.phone && <span id="phone-error" className="error-text">{formErrors.phone}</span>}
//             </div>
//           </div>

//           <div className='row mt-2'>
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="nic">NIC</label>
//               <input
//                 id="nic"
//                 type="text"
//                 name="nic"
//                 className="form-control"
//                 value={formData.nic}
//                 onChange={handleChange}
//                 placeholder="Enter NIC"
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label" htmlFor="license">License</label>
//               <input
//                 id="license"
//                 type="text"
//                 name="license"
//                 className="form-control"
//                 value={formData.license}
//                 onChange={handleChange}
//                 placeholder="Enter License"
//               />
//             </div>
//           </div>

//           <div className='row mt-2'>
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="jobPosition">Job Position</label>
//               <input
//                 id="jobPosition"
//                 type="text"
//                 name="jobPosition"
//                 className="form-control"
//                 value={formData.jobPosition}
//                 onChange={handleChange}
//                 placeholder="Enter Job Position"
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label" htmlFor="address">Address <span>*</span></label>
//               <input
//                 id="address"
//                 type="text"
//                 name="address"
//                 className="form-control"
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="Enter Address"
//                 required
//                 aria-describedby={formErrors.address ? 'address-error' : undefined}
//               />
//               {formErrors.address && <span id="address-error" className="error-text">{formErrors.address}</span>}
//             </div>
//           </div>

//           <div className='row mt-2'>
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="customerReview">Customer Review</label>
//               <select
//                 id="customerReview"
//                 name="customerReview"
//                 className="form-control"
//                 value={formData.customerReview}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Review</option>
//                 <option value="Good">Good</option>
//                 <option value="Normal">Normal</option>
//                 <option value="Bad">Bad</option>
//               </select>
//             </div>

//             {formData.customerReview && (
//               <div className="col-md-6">
//                 <label className="form-label" htmlFor="customerDescription">Customer Description</label>
//                 <input
//                   id="customerDescription"
//                   type="text"
//                   name="customerDescription"
//                   className="form-control"
//                   value={formData.customerDescription}
//                   onChange={handleChange}
//                   placeholder="Enter Customer Description"
//                 />
//               </div>
//             )}
//           </div>

//           <div className='row mt-2'>
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="nicFront">NIC Front</label>
//               <input id="nicFront" type="file" name="nicFront" className="form-control" onChange={handleFileChange} accept="image/*" />
//               {imagePreviews.nicFrontPreview && (
//                 <div className='mt-3'>
//                   <img
//                     src={imagePreviews.nicFrontPreview}
//                     alt="NIC Front Preview"
//                     className="preview-image"
//                     style={{ width: '250px', height: 'auto' }}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="col-md-6">
//               <label className="form-label" htmlFor="nicBack">NIC Back</label>
//               <input id="nicBack" type="file" name="nicBack" className="form-control" onChange={handleFileChange} accept="image/*" />
//               {imagePreviews.nicBackPreview && (
//                 <div className='mt-3'>
//                   <img
//                     src={imagePreviews.nicBackPreview}
//                     alt="NIC Back Preview"
//                     className="preview-image"
//                     style={{ width: '250px', height: 'auto' }}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* <div className="form-group">
//             <label htmlFor="guarantor">Guarantor</label>
//             <input
//               id="guarantor"
//               type="text"
//               name="guarantorName"
//               value={formData.guarantorName}
//               onChange={(e) => fetchGuarantorSuggestions(e.target.value)}
//               placeholder="Enter Guarantor Name"
//             />
//             {guarantorSuggestions.length > 0 && (
//               <ul className="list-group mt-0">
//                 {guarantorSuggestions.map((guarantor, index) => (
//                   <li
//                     key={index}
//                     className="list-group-item list-group-item-action"
//                     onClick={() => selectGuarantor(guarantor)}
//                   >
//                     {guarantor.guarantorName}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div> */}

//           <div className="form-actions">
//             <button type="button" onClick={closeModal}>Close</button>
//             <button type="submit">{cus ? 'Update' : 'Save Changes'}</button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Form;




//version 2


// import React, { useState, useEffect } from 'react';
// import config from '../../config';

// const Form = ({ closeModal, onSave, cus }) => {
//   const [formErrors, setFormErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     nic: '',
//     license: '',
//     jobPosition: '',
//     address: '',
//     customerReview: '',
//     customerDescription: '',
//     guarantorName: '',
//     guarantorNic: '',
//     nicFront: null,
//     nicBack: null,
//   });

//   useEffect(() => {
//     console.log("Editing customer:", cus);
//     if (cus) {
//       setFormData({
//         name: cus.cusName || '',
//         phone: cus.cusPhone || '',
//         nic: cus.nic || '',
//         license: cus.license || '',
//         jobPosition: cus.cusJob || '',
//         address: cus.cusAddress || '',
//         customerReview: typeof cus.customerReview === 'object' ?
//           (cus.customerReview.props?.children || '') :
//           (cus.customerReview || ''),
//         customerDescription: cus.customerDescription || '',
//       });
//       if (cus.nic) {
//         setImagePreviews({
//           nicFrontPreview: `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-front.jpg`,
//           nicBackPreview: `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-back.jpg`
//         });
//       }
//     }
//   }, [cus]);

//   const [imagePreviews, setImagePreviews] = useState({
//     nicFrontPreview: null,
//     nicBackPreview: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (formErrors[name]) {
//       setFormErrors({ ...formErrors, [name]: '' });
//     }
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     const file = files?.[0];

//     if (file) {
//       setFormData(prev => ({ ...prev, [name]: file }));

//       const imageURL = URL.createObjectURL(file);
//       setImagePreviews(prev => ({
//         ...prev,
//         [`${name}Preview`]: imageURL,
//       }));
//     }
//   };

//   const validate = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Name is required.';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required.';
//     }

//     if (!formData.address.trim()) {
//       errors.address = 'Address is required.';
//     }

//     return errors;
//   };

//   const handleSubmitCus = async (e) => {
//     e.preventDefault();

//     const errors = validate();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     setIsLoading(true); // Start loading

//     try {
//       const hasFileUpdates = formData.nicFront instanceof File || formData.nicBack instanceof File;

//       let requestBody;
//       let headers = {};

//       if (cus && !hasFileUpdates) {
//         requestBody = JSON.stringify({
//           cusId: cus.cusId,
//           cusName: formData.name.trim(),
//           cusPhone: formData.phone.trim(),
//           cusAddress: formData.address.trim(),
//           cusJob: formData.jobPosition?.trim() || '',
//           nic: formData.nic?.trim() || '',
//           license: formData.license?.trim() || '',
//           customerReview: formData.customerReview || '',
//           customerDescription: formData.customerDescription?.trim() || '',
//         });
//         headers['Content-Type'] = 'application/json';
//       } else {
//         requestBody = new FormData();
//         requestBody.append('cusName', formData.name.trim());
//         requestBody.append('cusPhone', formData.phone.trim());
//         requestBody.append('cusAddress', formData.address.trim());

//         if (formData.jobPosition) {
//           requestBody.append('cusJob', formData.jobPosition.trim());
//         }

//         if (formData.nic) {
//           requestBody.append('nic', formData.nic.trim());
//         }

//         if (formData.license) {
//           requestBody.append('license', formData.license.trim());
//         }

//         if (formData.customerReview) {
//           requestBody.append('customerReview', formData.customerReview);
//         }

//         if (formData.customerDescription) {
//           requestBody.append('customerDescription', formData.customerDescription.trim());
//         }

//         if (formData.nicFront instanceof File) {
//           requestBody.append('nicFront', formData.nicFront);
//         }

//         if (formData.nicBack instanceof File) {
//           requestBody.append('nicBack', formData.nicBack);
//         }
//       }

//       const url = cus
//         ? `${config.BASE_URL}/customer/${cus.cusId}`
//         : `${config.BASE_URL}/customer`;
//       const method = cus ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers,
//         body: requestBody,
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         switch (response.status) {
//           case 400:
//             window.alert('Save Unsuccessful: Please check the provided data and try again.');
//             break;
//           case 409:
//             window.alert('Save Unsuccessful: A customer with this information already exists.');
//             break;
//           case 413:
//             window.alert('Save Unsuccessful: The uploaded files are too large. Please use smaller files.');
//             break;
//           default:
//             window.alert('Save Unsuccessful: An error occurred while saving the customer.');
//         }
//         return;
//       }

//       window.alert('Saved Successfully!');

//       const updatedCustomer = cus
//         ? {
//           ...cus,
//           cusName: formData.name,
//           cusPhone: formData.phone,
//           cusAddress: formData.address,
//           cusJob: formData.jobPosition,
//           nic: formData.nic,
//           license: formData.license,
//           customerReview: formData.customerReview,
//           customerDescription: formData.customerDescription,
//         }
//         : responseData.newCustomer;

//       onSave(updatedCustomer);
//       closeModal();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       window.alert('Save Unsuccessful: An unexpected error occurred. Please try again later.');
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };




//   const [guarantorSuggestions, setGuarantorSuggestions] = useState([]);

//   const fetchGuarantorSuggestions = async (guarantorName) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName,
//     }));

//     if (!guarantorName.trim()) {
//       setGuarantorSuggestions([]);
//       return;
//     }

//     try {
//       const response = await fetch(`${config.BASE_URL}/guarantors/suggestions/${guarantorName}`);
//       const data = await response.json();

//       if (response.ok) {
//         setGuarantorSuggestions(data);
//       } else {
//         setGuarantorSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Error fetching guarantor suggestions', error);
//       setGuarantorSuggestions([]);
//     }
//   };

//   const selectGuarantor = (guarantor) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName: guarantor.guarantorName,
//       guarantorNic: guarantor.guarantorNic,
//     }));
//     setGuarantorSuggestions([]);
//   };

//   return (
//     <div style={{ placeItems: 'center' }}>
//       <h2>{cus ? 'Edit Customer' : 'New Customer'}</h2>

//       <form onSubmit={handleSubmitCus} autoComplete='off'>

//         <div className="row mt-2">
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="name">Name <span>*</span></label>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter Full Name"
//               className="form-control"
//               required
//               aria-describedby={formErrors.name ? 'name-error' : undefined}
//             />
//             {formErrors.name && <span id="name-error" className="error-text">{formErrors.name}</span>}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="phone">Phone <span>*</span></label>
//             <input
//               id="phone"
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter Phone"
//               required
//               aria-describedby={formErrors.phone ? 'phone-error' : undefined}
//             />
//             {formErrors.phone && <span id="phone-error" className="error-text">{formErrors.phone}</span>}
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nic">NIC</label>
//             <input
//               id="nic"
//               type="text"
//               name="nic"
//               className="form-control"
//               value={formData.nic}
//               onChange={handleChange}
//               placeholder="Enter NIC"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="license">License</label>
//             <input
//               id="license"
//               type="text"
//               name="license"
//               className="form-control"
//               value={formData.license}
//               onChange={handleChange}
//               placeholder="Enter License"
//             />
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="jobPosition">Job Position</label>
//             <input
//               id="jobPosition"
//               type="text"
//               name="jobPosition"
//               className="form-control"
//               value={formData.jobPosition}
//               onChange={handleChange}
//               placeholder="Enter Job Position"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="address">Address <span>*</span></label>
//             <input
//               id="address"
//               type="text"
//               name="address"
//               className="form-control"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter Address"
//               required
//               aria-describedby={formErrors.address ? 'address-error' : undefined}
//             />
//             {formErrors.address && <span id="address-error" className="error-text">{formErrors.address}</span>}
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="customerReview">Customer Review</label>
//             <select
//               id="customerReview"
//               name="customerReview"
//               className="form-control"
//               value={formData.customerReview}
//               onChange={handleChange}
//             >
//               <option value="">Select Review</option>
//               <option value="Good">Good</option>
//               <option value="Normal">Normal</option>
//               <option value="Bad">Bad</option>
//             </select>
//           </div>

//           {formData.customerReview && (
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="customerDescription">Customer Description</label>
//               <input
//                 id="customerDescription"
//                 type="text"
//                 name="customerDescription"
//                 className="form-control"
//                 value={formData.customerDescription}
//                 onChange={handleChange}
//                 placeholder="Enter Customer Description"
//               />
//             </div>
//           )}
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nicFront">NIC Front</label>
//             <input id="nicFront" type="file" name="nicFront" className="form-control" onChange={handleFileChange} accept="image/*" />
//             {imagePreviews.nicFrontPreview && (
//               <div className='mt-3'>
//                 <img
//                   src={imagePreviews.nicFrontPreview}
//                   alt="NIC Front Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nicBack">NIC Back</label>
//             <input id="nicBack" type="file" name="nicBack" className="form-control" onChange={handleFileChange} accept="image/*" />
//             {imagePreviews.nicBackPreview && (
//               <div className='mt-3'>
//                 <img
//                   src={imagePreviews.nicBackPreview}
//                   alt="NIC Back Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>


//         <div className="form-actions">
//           <button type="button" onClick={closeModal} disabled={isLoading}>Close</button>
//           <button type="submit" disabled={isLoading}>{cus ? 'Update' : 'Save Changes'}</button>
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         {isLoading && <div className="loading-message">Uploading Please Wait!</div>}
//       </form>
//     </div>
//   );
// };

// export default Form;


//version 3 with image size reduce


// import React, { useState, useEffect } from 'react';
// import config from '../../config';
// import imageCompression from 'browser-image-compression';

// const Form = ({ closeModal, onSave, cus }) => {
//   const [formErrors, setFormErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     nic: '',
//     license: '',
//     jobPosition: '',
//     address: '',
//     customerReview: '',
//     customerDescription: '',
//     guarantorName: '',
//     guarantorNic: '',
//     nicFront: null,
//     nicBack: null,
//   });

//   useEffect(() => {
//     console.log("Editing customer:", cus);
//     if (cus) {
//       setFormData({
//         name: cus.cusName || '',
//         phone: cus.cusPhone || '',
//         nic: cus.nic || '',
//         license: cus.license || '',
//         jobPosition: cus.cusJob || '',
//         address: cus.cusAddress || '',
//         customerReview: typeof cus.customerReview === 'object' ?
//           (cus.customerReview.props?.children || '') :
//           (cus.customerReview || ''),
//         customerDescription: cus.customerDescription || '',
//       });
//       if (cus.nic) {
//         setImagePreviews({
//           nicFrontPreview: `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-front.jpg`,
//           nicBackPreview: `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-back.jpg`
//         });
//       }
//     }
//   }, [cus]);

//   const [imagePreviews, setImagePreviews] = useState({
//     nicFrontPreview: null,
//     nicBackPreview: null,
//   });

//   const handleFileChange = async (e) => {
//     const { name, files } = e.target;
//     const file = files?.[0];

//     if (file) {
//       const options = {
//         maxSizeMB: 1, // Maximum size in MB
//         maxWidthOrHeight: 1024, // Maximum width or height
//         useWebWorker: true, // Use web worker for better performance
//       };

//       try {
//         const compressedFile = await imageCompression(file, options);
//         setFormData(prev => ({ ...prev, [name]: compressedFile }));

//         const imageURL = URL.createObjectURL(compressedFile);
//         setImagePreviews(prev => ({
//           ...prev,
//           [`${name}Preview`]: imageURL,
//         }));
//       } catch (error) {
//         console.error('Error compressing image:', error);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (formErrors[name]) {
//       setFormErrors({ ...formErrors, [name]: '' });
//     }
//   };



//   const validate = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Name is required.';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required.';
//     }

//     if (!formData.address.trim()) {
//       errors.address = 'Address is required.';
//     }

//     return errors;
//   };

//   const handleSubmitCus = async (e) => {
//     e.preventDefault();

//     const errors = validate();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const hasFileUpdates = formData.nicFront instanceof File || formData.nicBack instanceof File;

//       let requestBody;
//       let headers = {};

//       if (cus && !hasFileUpdates) {
//         // If no file updates, send JSON
//         requestBody = JSON.stringify({
//           cusId: cus.cusId,
//           cusName: formData.name.trim(),
//           cusPhone: formData.phone.trim(),
//           cusAddress: formData.address.trim(),
//           cusJob: formData.jobPosition?.trim() || '',
//           nic: formData.nic?.trim() || '',
//           license: formData.license?.trim() || '',
//           customerReview: formData.customerReview || '',
//           customerDescription: formData.customerDescription?.trim() || '',
//         });
//         headers['Content-Type'] = 'application/json';
//       } else {
//         // If files are present, use FormData
//         requestBody = new FormData();

//         if (cus) {
//           requestBody.append('cusId', cus.cusId);
//         }

//         requestBody.append('cusName', formData.name.trim());
//         requestBody.append('cusPhone', formData.phone.trim());
//         requestBody.append('cusAddress', formData.address.trim());

//         if (formData.jobPosition) {
//           requestBody.append('cusJob', formData.jobPosition.trim());
//         }

//         if (formData.nic) {
//           requestBody.append('nic', formData.nic.trim());
//         }

//         if (formData.license) {
//           requestBody.append('license', formData.license.trim());
//         }

//         if (formData.customerReview) {
//           requestBody.append('customerReview', formData.customerReview);
//         }

//         if (formData.customerDescription) {
//           requestBody.append('customerDescription', formData.customerDescription.trim());
//         }

//         if (formData.nicFront instanceof File) {
//           requestBody.append('nicFront', formData.nicFront);
//         }

//         if (formData.nicBack instanceof File) {
//           requestBody.append('nicBack', formData.nicBack);
//         }
//       }

//       const url = cus
//         ? `${config.BASE_URL}/customer/${cus.cusId}`
//         : `${config.BASE_URL}/customer`;
//       const method = cus ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers,
//         body: requestBody,
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         switch (response.status) {
//           case 400:
//             window.alert('Save Unsuccessful: Please check the provided data and try again.');
//             break;
//           case 409:
//             window.alert('Save Unsuccessful: A customer with this information already exists.');
//             break;
//           case 413:
//             window.alert('Save Unsuccessful: The uploaded files are too large. Please use smaller files.');
//             break;
//           default:
//             window.alert('Save Unsuccessful: An error occurred while saving the customer.');
//         }
//         return;
//       }

//       window.alert('Saved Successfully!');

//       const updatedCustomer = cus
//         ? {
//             ...cus,
//             cusName: formData.name,
//             cusPhone: formData.phone,
//             cusAddress: formData.address,
//             cusJob: formData.jobPosition,
//             nic: formData.nic,
//             license: formData.license,
//             customerReview: formData.customerReview,
//             customerDescription: formData.customerDescription,
//           }
//         : responseData.newCustomer;

//       onSave(updatedCustomer);
//       closeModal();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       window.alert('Save Unsuccessful: An unexpected error occurred. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };




//   const [guarantorSuggestions, setGuarantorSuggestions] = useState([]);

//   const fetchGuarantorSuggestions = async (guarantorName) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName,
//     }));

//     if (!guarantorName.trim()) {
//       setGuarantorSuggestions([]);
//       return;
//     }

//     try {
//       const response = await fetch(`${config.BASE_URL}/guarantors/suggestions/${guarantorName}`);
//       const data = await response.json();

//       if (response.ok) {
//         setGuarantorSuggestions(data);
//       } else {
//         setGuarantorSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Error fetching guarantor suggestions', error);
//       setGuarantorSuggestions([]);
//     }
//   };

//   const selectGuarantor = (guarantor) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName: guarantor.guarantorName,
//       guarantorNic: guarantor.guarantorNic,
//     }));
//     setGuarantorSuggestions([]);
//   };

//   return (
//     <div style={{ placeItems: 'center' }}>
//       <h2>{cus ? 'Edit Customer' : 'New Customer'}</h2>

//       <form onSubmit={handleSubmitCus} autoComplete='off'>

//         <div className="row mt-2">
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="name">Name <span>*</span></label>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter Full Name"
//               className="form-control"
//               required
//               aria-describedby={formErrors.name ? 'name-error' : undefined}
//             />
//             {formErrors.name && <span id="name-error" className="error-text">{formErrors.name}</span>}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="phone">Phone <span>*</span></label>
//             <input
//               id="phone"
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter Phone"
//               required
//               aria-describedby={formErrors.phone ? 'phone-error' : undefined}
//             />
//             {formErrors.phone && <span id="phone-error" className="error-text">{formErrors.phone}</span>}
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nic">NIC</label>
//             <input
//               id="nic"
//               type="text"
//               name="nic"
//               className="form-control"
//               value={formData.nic}
//               onChange={handleChange}
//               placeholder="Enter NIC"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="license">License</label>
//             <input
//               id="license"
//               type="text"
//               name="license"
//               className="form-control"
//               value={formData.license}
//               onChange={handleChange}
//               placeholder="Enter License"
//             />
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="jobPosition">Job Position</label>
//             <input
//               id="jobPosition"
//               type="text"
//               name="jobPosition"
//               className="form-control"
//               value={formData.jobPosition}
//               onChange={handleChange}
//               placeholder="Enter Job Position"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="address">Address <span>*</span></label>
//             <input
//               id="address"
//               type="text"
//               name="address"
//               className="form-control"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter Address"
//               required
//               aria-describedby={formErrors.address ? 'address-error' : undefined}
//             />
//             {formErrors.address && <span id="address-error" className="error-text">{formErrors.address}</span>}
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="customerReview">Customer Review</label>
//             <select
//               id="customerReview"
//               name="customerReview"
//               className="form-control"
//               value={formData.customerReview}
//               onChange={handleChange}
//             >
//               <option value="">Select Review</option>
//               <option value="Good">Good</option>
//               <option value="Normal">Normal</option>
//               <option value="Bad">Bad</option>
//             </select>
//           </div>

//           {formData.customerReview && (
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="customerDescription">Customer Description</label>
//               <input
//                 id="customerDescription"
//                 type="text"
//                 name="customerDescription"
//                 className="form-control"
//                 value={formData.customerDescription}
//                 onChange={handleChange}
//                 placeholder="Enter Customer Description"
//               />
//             </div>
//           )}
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nicFront">NIC Front</label>
//             <input id="nicFront" type="file" name="nicFront" className="form-control" onChange={handleFileChange} accept="image/*" />
//             {imagePreviews.nicFrontPreview && (
//               <div className='mt-3'>
//                 <img
//                   src={imagePreviews.nicFrontPreview}
//                   alt="NIC Front Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nicBack">NIC Back</label>
//             <input id="nicBack" type="file" name="nicBack" className="form-control" onChange={handleFileChange} accept="image/*" />
//             {imagePreviews.nicBackPreview && (
//               <div className='mt-3'>
//                 <img
//                   src={imagePreviews.nicBackPreview}
//                   alt="NIC Back Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>


//         <div className="form-actions">
//           <button type="button" onClick={closeModal} disabled={isLoading}>Close</button>
//           <button type="submit" disabled={isLoading}>{cus ? 'Update' : 'Save Changes'}</button>
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         {isLoading && <div className="loading-message">Uploading Please Wait!</div>}
//       </form>
//     </div>
//   );
// };

// export default Form;







//version4 create cus now compress image

// import React, { useState, useEffect } from 'react';
// import config from '../../config';

// const Form = ({ closeModal, onSave, cus }) => {
//   const [formErrors, setFormErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     nic: '',
//     license: '',
//     jobPosition: '',
//     address: '',
//     customerReview: '',
//     customerDescription: '',
//     guarantorName: '',
//     guarantorNic: '',
//     nicFront: null,
//     nicBack: null,
//   });

//   useEffect(() => {
//     console.log("Editing customer:", cus);
//     if (cus) {
//       setFormData({
//         name: cus.cusName || '',
//         phone: cus.cusPhone || '',
//         nic: cus.nic || '',
//         license: cus.license || '',
//         jobPosition: cus.cusJob || '',
//         address: cus.cusAddress || '',
//         customerReview: typeof cus.customerReview === 'object' ?
//           (cus.customerReview.props?.children || '') :
//           (cus.customerReview || ''),
//         customerDescription: cus.customerDescription || '',
//       });
//       if (cus.nic) {
//         setImagePreviews({
//           nicFrontPreview: `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-front.jpg`,
//           nicBackPreview: `${config.BASE_URL}/uploads/cusNicImages/${cus.nic}-back.jpg`
//         });
//       }
//     }
//   }, [cus]);

//   const [imagePreviews, setImagePreviews] = useState({
//     nicFrontPreview: null,
//     nicBackPreview: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (formErrors[name]) {
//       setFormErrors({ ...formErrors, [name]: '' });
//     }
//   };

//   // Image compression function
//   const compressImage = (file, maxWidth = 1024, maxQuality = 0.7) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;

//         img.onload = () => {
//           // Create canvas
//           const canvas = document.createElement('canvas');
//           let width = img.width;
//           let height = img.height;

//           // Calculate new dimensions maintaining aspect ratio
//           if (width > maxWidth) {
//             height = Math.round(height * maxWidth / width);
//             width = maxWidth;
//           }

//           // Set canvas dimensions
//           canvas.width = width;
//           canvas.height = height;

//           // Draw image on canvas
//           const ctx = canvas.getContext('2d');
//           ctx.drawImage(img, 0, 0, width, height);

//           // Convert canvas to Blob
//           canvas.toBlob((blob) => {
//             if (!blob) {
//               console.error("Canvas to Blob conversion failed");
//               resolve(file); // Return original file if compression fails
//               return;
//             }

//             // Create File object from Blob
//             const compressedFile = new File([blob], file.name, {
//               type: 'image/jpeg',
//               lastModified: Date.now()
//             });

//             console.log(`Compressed image size: ${compressedFile.size} bytes (${Math.round(compressedFile.size / 1024)} KB)`);
//             console.log(`Original image size: ${file.size} bytes (${Math.round(file.size / 1024)} KB)`);
//             console.log(`Compression ratio: ${Math.round((file.size - compressedFile.size) / file.size * 100)}%`);

//             resolve(compressedFile);
//           }, 'image/jpeg', maxQuality);
//         };
//       };
//       reader.onerror = () => {
//         console.error('Error reading file');
//         resolve(file); // Return original file if reading fails
//       };
//     });
//   };

//   const handleFileChange = async (e) => {
//     const { name, files } = e.target;
//     const file = files?.[0];

//     if (file) {
//       try {
//         // Show loading indicator for compression
//         setIsLoading(true);

//         // Compress the image
//         const compressedFile = await compressImage(file);

//         // Update form data with compressed file
//         setFormData(prev => ({ ...prev, [name]: compressedFile }));

//         // Create preview
//         const imageURL = URL.createObjectURL(compressedFile);
//         setImagePreviews(prev => ({
//           ...prev,
//           [`${name}Preview`]: imageURL,
//         }));
//       } catch (err) {
//         console.error("Image compression failed:", err);
//         // Fall back to original file
//         setFormData(prev => ({ ...prev, [name]: file }));
//         const imageURL = URL.createObjectURL(file);
//         setImagePreviews(prev => ({
//           ...prev,
//           [`${name}Preview`]: imageURL,
//         }));
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const validate = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Name is required.';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required.';
//     }

//     if (!formData.address.trim()) {
//       errors.address = 'Address is required.';
//     }

//     return errors;
//   };

//   const handleSubmitCus = async (e) => {
//     e.preventDefault();

//     const errors = validate();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     setIsLoading(true); // Start loading

//     try {
//       const hasFileUpdates = formData.nicFront instanceof File || formData.nicBack instanceof File;

//       let requestBody;
//       let headers = {};

//       if (cus && !hasFileUpdates) {
//         requestBody = JSON.stringify({
//           cusId: cus.cusId,
//           cusName: formData.name.trim(),
//           cusPhone: formData.phone.trim(),
//           cusAddress: formData.address.trim(),
//           cusJob: formData.jobPosition?.trim() || '',
//           nic: formData.nic?.trim() || '',
//           license: formData.license?.trim() || '',
//           customerReview: formData.customerReview || '',
//           customerDescription: formData.customerDescription?.trim() || '',
//         });
//         headers['Content-Type'] = 'application/json';
//       } else {
//         requestBody = new FormData();
//         requestBody.append('cusName', formData.name.trim());
//         requestBody.append('cusPhone', formData.phone.trim());
//         requestBody.append('cusAddress', formData.address.trim());

//         if (formData.jobPosition) {
//           requestBody.append('cusJob', formData.jobPosition.trim());
//         }

//         if (formData.nic) {
//           requestBody.append('nic', formData.nic.trim());
//         }

//         if (formData.license) {
//           requestBody.append('license', formData.license.trim());
//         }

//         if (formData.customerReview) {
//           requestBody.append('customerReview', formData.customerReview);
//         }

//         if (formData.customerDescription) {
//           requestBody.append('customerDescription', formData.customerDescription.trim());
//         }

//         if (formData.nicFront instanceof File) {
//           requestBody.append('nicFront', formData.nicFront);
//         }

//         if (formData.nicBack instanceof File) {
//           requestBody.append('nicBack', formData.nicBack);
//         }
//       }

//       const url = cus
//         ? `${config.BASE_URL}/customer/${cus.cusId}`
//         : `${config.BASE_URL}/customer`;
//       const method = cus ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers,
//         body: requestBody,
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         switch (response.status) {
//           case 400:
//             window.alert('Save Unsuccessful: Please check the provided data and try again.');
//             break;
//           case 409:
//             window.alert('Save Unsuccessful: A customer with this information already exists.');
//             break;
//           case 413:
//             window.alert('Save Unsuccessful: The uploaded files are too large. Please use smaller files.');
//             break;
//           default:
//             window.alert('Save Unsuccessful: An error occurred while saving the customer.');
//         }
//         return;
//       }

//       window.alert('Saved Successfully!');

//       const updatedCustomer = cus
//         ? {
//           ...cus,
//           cusName: formData.name,
//           cusPhone: formData.phone,
//           cusAddress: formData.address,
//           cusJob: formData.jobPosition,
//           nic: formData.nic,
//           license: formData.license,
//           customerReview: formData.customerReview,
//           customerDescription: formData.customerDescription,
//         }
//         : responseData.newCustomer;

//       onSave(updatedCustomer);
//       closeModal();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       window.alert('Save Unsuccessful: An unexpected error occurred. Please try again later.');
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   const [guarantorSuggestions, setGuarantorSuggestions] = useState([]);

//   const fetchGuarantorSuggestions = async (guarantorName) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName,
//     }));

//     if (!guarantorName.trim()) {
//       setGuarantorSuggestions([]);
//       return;
//     }

//     try {
//       const response = await fetch(`${config.BASE_URL}/guarantors/suggestions/${guarantorName}`);
//       const data = await response.json();

//       if (response.ok) {
//         setGuarantorSuggestions(data);
//       } else {
//         setGuarantorSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Error fetching guarantor suggestions', error);
//       setGuarantorSuggestions([]);
//     }
//   };

//   const selectGuarantor = (guarantor) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName: guarantor.guarantorName,
//       guarantorNic: guarantor.guarantorNic,
//     }));
//     setGuarantorSuggestions([]);
//   };

//   return (
//     <div style={{ placeItems: 'center' }}>
//       <h2>{cus ? 'Edit Customer' : 'New Customer'}</h2>

//       <form onSubmit={handleSubmitCus} autoComplete='off'>

//         <div className="row mt-2">
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="name">Name <span>*</span></label>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter Full Name"
//               className="form-control"
//               required
//               aria-describedby={formErrors.name ? 'name-error' : undefined}
//             />
//             {formErrors.name && <span id="name-error" className="error-text">{formErrors.name}</span>}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="phone">Phone <span>*</span></label>
//             <input
//               id="phone"
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter Phone"
//               required
//               aria-describedby={formErrors.phone ? 'phone-error' : undefined}
//             />
//             {formErrors.phone && <span id="phone-error" className="error-text">{formErrors.phone}</span>}
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nic">NIC</label>
//             <input
//               id="nic"
//               type="text"
//               name="nic"
//               className="form-control"
//               value={formData.nic}
//               onChange={handleChange}
//               placeholder="Enter NIC"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="license">License</label>
//             <input
//               id="license"
//               type="text"
//               name="license"
//               className="form-control"
//               value={formData.license}
//               onChange={handleChange}
//               placeholder="Enter License"
//             />
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="jobPosition">Job Position</label>
//             <input
//               id="jobPosition"
//               type="text"
//               name="jobPosition"
//               className="form-control"
//               value={formData.jobPosition}
//               onChange={handleChange}
//               placeholder="Enter Job Position"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="address">Address <span>*</span></label>
//             <input
//               id="address"
//               type="text"
//               name="address"
//               className="form-control"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter Address"
//               required
//               aria-describedby={formErrors.address ? 'address-error' : undefined}
//             />
//             {formErrors.address && <span id="address-error" className="error-text">{formErrors.address}</span>}
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="customerReview">Customer Review</label>
//             <select
//               id="customerReview"
//               name="customerReview"
//               className="form-control"
//               value={formData.customerReview}
//               onChange={handleChange}
//             >
//               <option value="">Select Review</option>
//               <option value="Good">Good</option>
//               <option value="Normal">Normal</option>
//               <option value="Bad">Bad</option>
//             </select>
//           </div>

//           {formData.customerReview && (
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="customerDescription">Customer Description</label>
//               <input
//                 id="customerDescription"
//                 type="text"
//                 name="customerDescription"
//                 className="form-control"
//                 value={formData.customerDescription}
//                 onChange={handleChange}
//                 placeholder="Enter Customer Description"
//               />
//             </div>
//           )}
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//           <label className="form-label" htmlFor="nicFront">NIC Front</label>
//             <input id="nicFront" type="file" name="nicFront" className="form-control" onChange={handleFileChange} accept="image/*" />
//             {imagePreviews.nicFrontPreview && (
//               <div className='mt-3'>
//                 <img
//                   src={imagePreviews.nicFrontPreview}
//                   alt="NIC Front Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nicBack">NIC Back</label>
//             <input id="nicBack" type="file" name="nicBack" className="form-control" onChange={handleFileChange} accept="image/*" />
//             {imagePreviews.nicBackPreview && (
//               <div className='mt-3'>
//                 <img
//                   src={imagePreviews.nicBackPreview}
//                   alt="NIC Back Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="form-actions">
//           <button type="button" onClick={closeModal} disabled={isLoading}>Close</button>
//           <button type="submit" disabled={isLoading}>{cus ? 'Update' : 'Save Changes'}</button>
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         {isLoading && <div className="loading-message">Uploading Please Wait!</div>}
//       </form>
//     </div>
//   );
// };

// export default Form;




//version image compress when update fix

// import React, { useState, useEffect } from 'react';
// import config from '../../config';

// const Form = ({ closeModal, onSave, cus }) => {
//   const [formErrors, setFormErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     nic: '',
//     license: '',
//     jobPosition: '',
//     address: '',
//     customerReview: '',
//     customerDescription: '',
//     guarantorName: '',
//     guarantorNic: '',
//     nicFront: null,
//     nicBack: null,
//   });

//   useEffect(() => {
//     console.log("Editing customer:", cus);
//     if (cus) {
//       setFormData({
//         name: cus.cusName || '',
//         phone: cus.cusPhone || '',
//         nic: cus.nic || '',
//         license: cus.license || '',
//         jobPosition: cus.cusJob || '',
//         address: cus.cusAddress || '',
//         customerReview: typeof cus.customerReview === 'object' ?
//           (cus.customerReview.props?.children || '') :
//           (cus.customerReview || ''),
//         customerDescription: cus.customerDescription || '',
//       });

//       // Set image previews if the customer has NIC images
//       if (cus.nicFront || cus.nicBack) {
//         setImagePreviews({
//           nicFrontPreview: cus.nicFront ? `${config.BASE_URL}${cus.nicFront}` : null,
//           nicBackPreview: cus.nicBack ? `${config.BASE_URL}${cus.nicBack}` : null
//         });
//       }
//     }
//   }, [cus]);

//   const [imagePreviews, setImagePreviews] = useState({
//     nicFrontPreview: null,
//     nicBackPreview: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (formErrors[name]) {
//       setFormErrors({ ...formErrors, [name]: '' });
//     }
//   };

//   // Image compression function
//   const compressImage = (file, maxWidth = 1024, maxQuality = 0.7) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;

//         img.onload = () => {
//           // Create canvas
//           const canvas = document.createElement('canvas');
//           let width = img.width;
//           let height = img.height;

//           // Calculate new dimensions maintaining aspect ratio
//           if (width > maxWidth) {
//             height = Math.round(height * maxWidth / width);
//             width = maxWidth;
//           }

//           // Set canvas dimensions
//           canvas.width = width;
//           canvas.height = height;

//           // Draw image on canvas
//           const ctx = canvas.getContext('2d');
//           ctx.drawImage(img, 0, 0, width, height);

//           // Convert canvas to Blob
//           canvas.toBlob((blob) => {
//             if (!blob) {
//               console.error("Canvas to Blob conversion failed");
//               resolve(file); // Return original file if compression fails
//               return;
//             }

//             // Create File object from Blob
//             const compressedFile = new File([blob], file.name, {
//               type: 'image/jpeg',
//               lastModified: Date.now()
//             });

//             console.log(`Compressed image size: ${compressedFile.size} bytes (${Math.round(compressedFile.size / 1024)} KB)`);
//             console.log(`Original image size: ${file.size} bytes (${Math.round(file.size / 1024)} KB)`);
//             console.log(`Compression ratio: ${Math.round((file.size - compressedFile.size) / file.size * 100)}%`);

//             resolve(compressedFile);
//           }, 'image/jpeg', maxQuality);
//         };
//       };
//       reader.onerror = () => {
//         console.error('Error reading file');
//         resolve(file); // Return original file if reading fails
//       };
//     });
//   };

//   const handleFileChange = async (e) => {
//     const { name, files } = e.target;
//     const file = files?.[0];

//     if (file) {
//       try {
//         // Show loading indicator for compression
//         setIsLoading(true);

//         // Compress the image
//         const compressedFile = await compressImage(file);

//         // Update form data with compressed file
//         setFormData(prev => ({ ...prev, [name]: compressedFile }));

//         // Create preview
//         const imageURL = URL.createObjectURL(compressedFile);
//         setImagePreviews(prev => ({
//           ...prev,
//           [`${name}Preview`]: imageURL,
//         }));
//       } catch (err) {
//         console.error("Image compression failed:", err);
//         // Fall back to original file
//         setFormData(prev => ({ ...prev, [name]: file }));
//         const imageURL = URL.createObjectURL(file);
//         setImagePreviews(prev => ({
//           ...prev,
//           [`${name}Preview`]: imageURL,
//         }));
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const validate = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Name is required.';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required.';
//     }

//     if (!formData.address.trim()) {
//       errors.address = 'Address is required.';
//     }

//     return errors;
//   };

//   const handleSubmitCus = async (e) => {
//     e.preventDefault();

//     const errors = validate();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     setIsLoading(true); // Start loading

//     try {
//       const isUpdate = !!cus;
//       const hasFileUpdates = formData.nicFront instanceof File || formData.nicBack instanceof File;

//       let response;

//       // JSON approach - for updates without file changes
//       if (isUpdate && !hasFileUpdates) {
//         const jsonBody = JSON.stringify({
//           cusId: cus.cusId,
//           cusName: formData.name.trim(),
//           cusPhone: formData.phone.trim(),
//           cusAddress: formData.address.trim(),
//           cusJob: formData.jobPosition?.trim() || '',
//           nic: formData.nic?.trim() || '',
//           license: formData.license?.trim() || '',
//           customerReview: formData.customerReview || '',
//           customerDescription: formData.customerDescription?.trim() || '',
//         });

//         response = await fetch(`${config.BASE_URL}/customer/${cus.cusId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: jsonBody,
//         });
//       } 
//       // FormData approach - for new customers or updates with file changes
//       else {
//         const formDataBody = new FormData();

//         // If updating, include customer ID
//         if (isUpdate) {
//           formDataBody.append('cusId', cus.cusId);

//           // Include existing image references if no new files are uploaded
//           if (!formData.nicFront && cus.nicFront) {
//             formDataBody.append('existingNicFront', `${cus.nic}-front.jpg`);
//           }
//           if (!formData.nicBack && cus.nicBack) {
//             formDataBody.append('existingNicBack', `${cus.nic}-back.jpg`);
//           }
//         }

//         // Add all the form fields
//         formDataBody.append('cusName', formData.name.trim());
//         formDataBody.append('cusPhone', formData.phone.trim());
//         formDataBody.append('cusAddress', formData.address.trim());

//         if (formData.jobPosition) {
//           formDataBody.append('cusJob', formData.jobPosition.trim());
//         }

//         if (formData.nic) {
//           formDataBody.append('nic', formData.nic.trim());
//         }

//         if (formData.license) {
//           formDataBody.append('license', formData.license.trim());
//         }

//         if (formData.customerReview) {
//           formDataBody.append('customerReview', formData.customerReview);
//         }

//         if (formData.customerDescription) {
//           formDataBody.append('customerDescription', formData.customerDescription.trim());
//         }

//         // Add files only if they've been selected
//         if (formData.nicFront instanceof File) {
//           formDataBody.append('nicFront', formData.nicFront);
//         }

//         if (formData.nicBack instanceof File) {
//           formDataBody.append('nicBack', formData.nicBack);
//         }

//         const url = isUpdate 
//           ? `${config.BASE_URL}/customer/${cus.cusId}`
//           : `${config.BASE_URL}/customer`;

//         const method = isUpdate ? 'PUT' : 'POST';

//         response = await fetch(url, {
//           method,
//           // No Content-Type header for FormData
//           body: formDataBody,
//         });
//       }

//       const responseData = await response.json();

//       if (!response.ok) {
//         switch (response.status) {
//           case 400:
//             window.alert('Save Unsuccessful: Please check the provided data and try again.');
//             break;
//           case 409:
//             window.alert('Save Unsuccessful: A customer with this information already exists.');
//             break;
//           case 413:
//             window.alert('Save Unsuccessful: The uploaded files are too large. Please use smaller files.');
//             break;
//           default:
//             window.alert('Save Unsuccessful: An error occurred while saving the customer.');
//         }
//         return;
//       }

//       window.alert('Saved Successfully!');

//       const updatedCustomer = cus
//         ? {
//           ...cus,
//           cusName: formData.name,
//           cusPhone: formData.phone,
//           cusAddress: formData.address,
//           cusJob: formData.jobPosition,
//           nic: formData.nic,
//           license: formData.license,
//           customerReview: formData.customerReview,
//           customerDescription: formData.customerDescription,
//         }
//         : responseData.newCustomer;

//       onSave(updatedCustomer);
//       closeModal();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       window.alert('Save Unsuccessful: An unexpected error occurred. Please try again later.');
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   const [guarantorSuggestions, setGuarantorSuggestions] = useState([]);

//   const fetchGuarantorSuggestions = async (guarantorName) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName,
//     }));

//     if (!guarantorName.trim()) {
//       setGuarantorSuggestions([]);
//       return;
//     }

//     try {
//       const response = await fetch(`${config.BASE_URL}/guarantors/suggestions/${guarantorName}`);
//       const data = await response.json();

//       if (response.ok) {
//         setGuarantorSuggestions(data);
//       } else {
//         setGuarantorSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Error fetching guarantor suggestions', error);
//       setGuarantorSuggestions([]);
//     }
//   };

//   const selectGuarantor = (guarantor) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName: guarantor.guarantorName,
//       guarantorNic: guarantor.guarantorNic,
//     }));
//     setGuarantorSuggestions([]);
//   };

//   return (
//     <div style={{ placeItems: 'center' }}>
//       <h2>{cus ? 'Edit Customer' : 'New Customer'}</h2>

//       <form onSubmit={handleSubmitCus} autoComplete='off'>

//         <div className="row mt-2">
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="name">Name <span>*</span></label>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter Full Name"
//               className="form-control"
//               required
//               aria-describedby={formErrors.name ? 'name-error' : undefined}
//             />
//             {formErrors.name && <span id="name-error" className="error-text">{formErrors.name}</span>}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="phone">Phone <span>*</span></label>
//             <input
//               id="phone"
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter Phone"
//               required
//               aria-describedby={formErrors.phone ? 'phone-error' : undefined}
//             />
//             {formErrors.phone && <span id="phone-error" className="error-text">{formErrors.phone}</span>}
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nic">NIC</label>
//             <input
//               id="nic"
//               type="text"
//               name="nic"
//               className="form-control"
//               value={formData.nic}
//               onChange={handleChange}
//               placeholder="Enter NIC"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="license">License</label>
//             <input
//               id="license"
//               type="text"
//               name="license"
//               className="form-control"
//               value={formData.license}
//               onChange={handleChange}
//               placeholder="Enter License"
//             />
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="jobPosition">Job Position</label>
//             <input
//               id="jobPosition"
//               type="text"
//               name="jobPosition"
//               className="form-control"
//               value={formData.jobPosition}
//               onChange={handleChange}
//               placeholder="Enter Job Position"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="address">Address <span>*</span></label>
//             <input
//               id="address"
//               type="text"
//               name="address"
//               className="form-control"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter Address"
//               required
//               aria-describedby={formErrors.address ? 'address-error' : undefined}
//             />
//             {formErrors.address && <span id="address-error" className="error-text">{formErrors.address}</span>}
//           </div>
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="customerReview">Customer Review</label>
//             <select
//               id="customerReview"
//               name="customerReview"
//               className="form-control"
//               value={formData.customerReview}
//               onChange={handleChange}
//             >
//               <option value="">Select Review</option>
//               <option value="Good">Good</option>
//               <option value="Normal">Normal</option>
//               <option value="Bad">Bad</option>
//             </select>
//           </div>

//           {formData.customerReview && (
//             <div className="col-md-6">
//               <label className="form-label" htmlFor="customerDescription">Customer Description</label>
//               <input
//                 id="customerDescription"
//                 type="text"
//                 name="customerDescription"
//                 className="form-control"
//                 value={formData.customerDescription}
//                 onChange={handleChange}
//                 placeholder="Enter Customer Description"
//               />
//             </div>
//           )}
//         </div>

//         <div className='row mt-2'>
//           <div className="col-md-6">
//           <label className="form-label" htmlFor="nicFront">NIC Front</label>
//             <input id="nicFront" type="file" name="nicFront" className="form-control" onChange={handleFileChange} accept="image/*" />
//             {imagePreviews.nicFrontPreview && (
//               <div className='mt-3'>
//                 <img
//                   src={imagePreviews.nicFrontPreview}
//                   alt="NIC Front Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nicBack">NIC Back</label>
//             <input id="nicBack" type="file" name="nicBack" className="form-control" onChange={handleFileChange} accept="image/*" />
//             {imagePreviews.nicBackPreview && (
//               <div className='mt-3'>
//                 <img
//                   src={imagePreviews.nicBackPreview}
//                   alt="NIC Back Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="form-actions">
//           <button type="button" onClick={closeModal} disabled={isLoading}>Close</button>
//           <button type="submit" disabled={isLoading}>{cus ? 'Update' : 'Save Changes'}</button>
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         {isLoading && <div className="loading-message">Uploading Please Wait!</div>}
//       </form>
//     </div>
//   );
// };

// export default Form;






//original version



// import React, { useState, useEffect } from 'react';
// import config from '../../config';

// const Form = ({ closeModal, onSave, cus }) => {
//   const [formErrors, setFormErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     nic: '',
//     license: '',
//     jobPosition: '',
//     address: '',
//     customerReview: '',
//     customerDescription: '',
//     guarantorName: '',
//     guarantorNic: '',
//     nicFront: null,
//     nicBack: null,
//   });

//   useEffect(() => {
//     console.log("Editing customer:", cus);
//     if (cus) {
//       setFormData({
//         name: cus.cusName || '',
//         phone: cus.cusPhone || '',
//         nic: cus.nic || '',
//         license: cus.license || '',
//         jobPosition: cus.cusJob || '',
//         address: cus.cusAddress || '',
//         customerReview: cus.customerReview || '',  // Keep the existing review value
//         customerDescription: cus.customerDescription || '',
//       });

//       // Set image previews if the customer has NIC images
//       if (cus.nicFront || cus.nicBack) {
//         setImagePreviews({
//           nicFrontPreview: cus.nicFront ? `${config.BASE_URL}${cus.nicFront}` : null,
//           nicBackPreview: cus.nicBack ? `${config.BASE_URL}${cus.nicBack}` : null
//         });
//       }
//     }
//   }, [cus]);

//   const [imagePreviews, setImagePreviews] = useState({
//     nicFrontPreview: null,
//     nicBackPreview: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (formErrors[name]) {
//       setFormErrors({ ...formErrors, [name]: '' });
//     }
//   };

//   // Image compression function
//   // const compressImage = (file, maxWidth = 1024, maxQuality = 0.7) => {
//   //   return new Promise((resolve) => {
//   //     const reader = new FileReader();
//   //     reader.readAsDataURL(file);
//   //     reader.onload = (event) => {
//   //       const img = new Image();
//   //       img.src = event.target.result;

//   //       img.onload = () => {
//   //         // Create canvas
//   //         const canvas = document.createElement('canvas');
//   //         let width = img.width;
//   //         let height = img.height;

//   //         // Calculate new dimensions maintaining aspect ratio
//   //         if (width > maxWidth) {
//   //           height = Math.round(height * maxWidth / width);
//   //           width = maxWidth;
//   //         }

//   //         // Set canvas dimensions
//   //         canvas.width = width;
//   //         canvas.height = height;

//   //         // Draw image on canvas
//   //         const ctx = canvas.getContext('2d');
//   //         ctx.drawImage(img, 0, 0, width, height);

//   //         // Convert canvas to Blob
//   //         canvas.toBlob((blob) => {
//   //           if (!blob) {
//   //             console.error("Canvas to Blob conversion failed");
//   //             resolve(file); // Return original file if compression fails
//   //             return;
//   //           }

//   //           // Create File object from Blob
//   //           const compressedFile = new File([blob], file.name, {
//   //             type: 'image/jpeg',
//   //             lastModified: Date.now()
//   //           });

//   //           console.log(`Compressed image size: ${compressedFile.size} bytes (${Math.round(compressedFile.size / 1024)} KB)`);
//   //           console.log(`Original image size: ${file.size} bytes (${Math.round(file.size / 1024)} KB)`);
//   //           console.log(`Compression ratio: ${Math.round((file.size - compressedFile.size) / file.size * 100)}%`);

//   //           resolve(compressedFile);
//   //         }, 'image/jpeg', maxQuality);
//   //       };
//   //     };
//   //     reader.onerror = () => {
//   //       console.error('Error reading file');
//   //       resolve(file); // Return original file if reading fails
//   //     };
//   //   });
//   // };

//   const compressImage = (file, maxWidth = 1024, maxQuality = 0.7) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;
  
//         img.onload = () => {
//           const canvas = document.createElement('canvas');
//           let width = img.width;
//           let height = img.height;
  
//           if (width > maxWidth) {
//             height = Math.round(height * maxWidth / width);
//             width = maxWidth;
//           }
  
//           canvas.width = width;
//           canvas.height = height;
  
//           const ctx = canvas.getContext('2d');
//           ctx.drawImage(img, 0, 0, width, height);
  
//           canvas.toBlob((blob) => {
//             if (!blob) {
//               console.error("Canvas to Blob conversion failed");
//               resolve(file); // Return original file if compression fails
//               return;
//             }
  
//             const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
//               type: 'image/jpeg',
//               lastModified: Date.now()
//             });
  
//             resolve(compressedFile);
//           }, 'image/jpeg', maxQuality);
//         };
//       };
//       reader.onerror = () => {
//         console.error('Error reading file');
//         resolve(file); // Return original file if reading fails
//       };
//     });
//   };

//   const handleFileChange = async (e) => {
//     const { name, files } = e.target;
//     const file = files?.[0];

//     if (file) {
//       try {
//         // Show loading indicator for compression
//         setIsLoading(true);

//         // Compress the image
//         const compressedFile = await compressImage(file);

//         // Update form data with compressed file
//         setFormData(prev => ({ ...prev, [name]: compressedFile }));

//         // Create preview
//         const imageURL = URL.createObjectURL(compressedFile);
//         setImagePreviews(prev => ({
//           ...prev,
//           [`${name}Preview`]: imageURL,
//         }));
//       } catch (err) {
//         console.error("Image compression failed:", err);
//         // Fall back to original file
//         setFormData(prev => ({ ...prev, [name]: file }));
//         const imageURL = URL.createObjectURL(file);
//         setImagePreviews(prev => ({
//           ...prev,
//           [`${name}Preview`]: imageURL,
//         }));
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const validate = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Name is required.';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required.';
//     }

//     if (!formData.address.trim()) {
//       errors.address = 'Address is required.';
//     }

//     return errors;
//   };

//   // Check if a customer with the same NIC already exists
//   const checkNicExists = async (nic) => {
//     if (!nic.trim()) return false;

//     try {
//       const response = await fetch(`${config.BASE_URL}/customer/check-nic/${nic}`);
//       const data = await response.json();
//       return response.ok && data.exists;
//     } catch (error) {
//       console.error('Error checking NIC:', error);
//       return false;
//     }
//   };

//   const handleSubmitCus = async (e) => {
//     e.preventDefault();

//     const errors = validate();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     setIsLoading(true); // Start loading

//     try {
//       const isUpdate = !!cus;

//       // Check if NIC already exists for new customers
//       if (!isUpdate && formData.nic.trim()) {
//         const nicExists = await checkNicExists(formData.nic);
//         if (nicExists) {
//           window.alert('Customer already exists with this NIC!');
//           setIsLoading(false);
//           return;
//         }
//       }

//       const hasFileUpdates = formData.nicFront instanceof File || formData.nicBack instanceof File;

//       let response;

//       // JSON approach - for updates without file changes
//       if (isUpdate && !hasFileUpdates) {
//         const jsonBody = JSON.stringify({
//           cusId: cus.cusId,
//           cusName: formData.name.trim(),
//           cusPhone: formData.phone.trim(),
//           cusAddress: formData.address.trim(),
//           cusJob: formData.jobPosition?.trim() || '',
//           nic: formData.nic?.trim() || '',
//           license: formData.license?.trim() || '',
//           customerReview: formData.customerReview || '',
//           customerDescription: formData.customerDescription?.trim() || '',
//         });

//         response = await fetch(`${config.BASE_URL}/customer/${cus.cusId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: jsonBody,
//         });
//       }
//       // FormData approach - for new customers or updates with file changes
//       else {
//         const formDataBody = new FormData();

//         // If updating, include customer ID
//         if (isUpdate) {
//           formDataBody.append('cusId', cus.cusId);

//           // Include existing image references if no new files are uploaded
//           if (!formData.nicFront && cus.nicFront) {
//             formDataBody.append('existingNicFront', `${cus.nic}-front.jpg`);
//           }
//           if (!formData.nicBack && cus.nicBack) {
//             formDataBody.append('existingNicBack', `${cus.nic}-back.jpg`);
//           }
//         }

//         // Add all the form fields
//         formDataBody.append('cusName', formData.name.trim());
//         formDataBody.append('cusPhone', formData.phone.trim());
//         formDataBody.append('cusAddress', formData.address.trim());

//         if (formData.jobPosition) {
//           formDataBody.append('cusJob', formData.jobPosition.trim());
//         }

//         if (formData.nic) {
//           formDataBody.append('nic', formData.nic.trim());
//         }

//         if (formData.license) {
//           formDataBody.append('license', formData.license.trim());
//         }

//         if (formData.customerReview) {
//           formDataBody.append('customerReview', formData.customerReview);
//         }

//         if (formData.customerDescription) {
//           formDataBody.append('customerDescription', formData.customerDescription.trim());
//         }

//         // Add files only if they've been selected
//         if (formData.nicFront instanceof File) {
//           formDataBody.append('nicFront', formData.nicFront);
//         }

//         if (formData.nicBack instanceof File) {
//           formDataBody.append('nicBack', formData.nicBack);
//         }

//         const url = isUpdate
//           ? `${config.BASE_URL}/customer/${cus.cusId}`
//           : `${config.BASE_URL}/customer`;

//         const method = isUpdate ? 'PUT' : 'POST';

//         response = await fetch(url, {
//           method,
//           // No Content-Type header for FormData
//           body: formDataBody,
//         });
//       }

//       const responseData = await response.json();

//       if (!response.ok) {
//         switch (response.status) {
//           case 400:
//             window.alert('Save Unsuccessful: Please check the provided data and try again.');
//             break;
//           case 409:
//             window.alert('Save Unsuccessful: A customer with this information already exists.');
//             break;
//           case 413:
//             window.alert('Save Unsuccessful: The uploaded files are too large. Please use smaller files.');
//             break;
//           default:
//             window.alert('Save Unsuccessful: An error occurred while saving the customer.');
//         }
//         return;
//       }

//       window.alert('Saved Successfully!');

//       const updatedCustomer = cus
//         ? {
//           ...cus,
//           cusName: formData.name,
//           cusPhone: formData.phone,
//           cusAddress: formData.address,
//           cusJob: formData.jobPosition,
//           nic: formData.nic,
//           license: formData.license,
//           customerReview: formData.customerReview,
//           customerDescription: formData.customerDescription,
//         }
//         : responseData.newCustomer;

//       onSave(updatedCustomer);
//       closeModal();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       window.alert('Save Unsuccessful: An unexpected error occurred. Please try again later.');
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   const [guarantorSuggestions, setGuarantorSuggestions] = useState([]);

//   const fetchGuarantorSuggestions = async (guarantorName) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName,
//     }));

//     if (!guarantorName.trim()) {
//       setGuarantorSuggestions([]);
//       return;
//     }

//     try {
//       const response = await fetch(`${config.BASE_URL}/guarantors/suggestions/${guarantorName}`);
//       const data = await response.json();

//       if (response.ok) {
//         setGuarantorSuggestions(data);
//       } else {
//         setGuarantorSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Error fetching guarantor suggestions', error);
//       setGuarantorSuggestions([]);
//     }
//   };

//   const selectGuarantor = (guarantor) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       guarantorName: guarantor.guarantorName,
//       guarantorNic: guarantor.guarantorNic,
//     }));
//     setGuarantorSuggestions([]);
//   };

//   return (
//     <div style={{ placeItems: 'center' }}>
//       <h2>{cus ? 'Edit Customer' : 'New Customer'}</h2>
//       <form onSubmit={handleSubmitCus} autoComplete="off">
//         <div className="row mt-2">
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="name">
//               Name <span>*</span>
//             </label>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter Full Name"
//               className="form-control"
//               required
//               aria-describedby={formErrors.name ? 'name-error' : undefined}
//             />
//             {formErrors.name && (
//               <span id="name-error" className="error-text">
//                 {formErrors.name}
//               </span>
//             )}
//           </div>
  
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="phone">
//               Phone <span>*</span>
//             </label>
//             <input
//               id="phone"
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter Phone"
//               required
//               aria-describedby={formErrors.phone ? 'phone-error' : undefined}
//             />
//             {formErrors.phone && (
//               <span id="phone-error" className="error-text">
//                 {formErrors.phone}
//               </span>
//             )}
//           </div>
//         </div>
  
//         <div className="row mt-2">
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nic">
//               NIC
//             </label>
//             <input
//               id="nic"
//               type="text"
//               name="nic"
//               className="form-control"
//               value={formData.nic}
//               onChange={handleChange}
//               placeholder="Enter NIC"
//             />
//           </div>
  
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="license">
//               License
//             </label>
//             <input
//               id="license"
//               type="text"
//               name="license"
//               className="form-control"
//               value={formData.license}
//               onChange={handleChange}
//               placeholder="Enter License"
//             />
//           </div>
//         </div>
  
//         <div className="row mt-2">
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="jobPosition">
//               Job Position
//             </label>
//             <input
//               id="jobPosition"
//               type="text"
//               name="jobPosition"
//               className="form-control"
//               value={formData.jobPosition}
//               onChange={handleChange}
//               placeholder="Enter Job Position"
//             />
//           </div>
  
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="address">
//               Address <span>*</span>
//             </label>
//             <input
//               id="address"
//               type="text"
//               name="address"
//               className="form-control"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter Address"
//               required
//               aria-describedby={formErrors.address ? 'address-error' : undefined}
//             />
//             {formErrors.address && (
//               <span id="address-error" className="error-text">
//                 {formErrors.address}
//               </span>
//             )}
//           </div>
//         </div>
  
//         <div className="row mt-2">
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="customerReview">
//               Customer Review
//             </label>
//             <select
//               id="customerReview"
//               name="customerReview"
//               className="form-control"
//               value={formData.customerReview}
//               onChange={handleChange}
//             >
//               <option value="">Select Review</option>
//               <option value="Good">Good</option>
//               <option value="Normal">Normal</option>
//               <option value="Bad">Bad</option>
//             </select>
//           </div>
  
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="customerDescription">
//               Customer Description
//             </label>
//             <input
//               id="customerDescription"
//               type="text"
//               name="customerDescription"
//               className="form-control"
//               value={formData.customerDescription}
//               onChange={handleChange}
//               placeholder="Enter Customer Description"
//             />
//           </div>
//         </div>
  
//         <div className="row mt-2">
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nicFront">
//               NIC Front
//             </label>
//             <input
//               id="nicFront"
//               type="file"
//               name="nicFront"
//               className="form-control"
//               onChange={handleFileChange}
//               accept="image/*"
//             />
//             {imagePreviews.nicFrontPreview && (
//               <div className="mt-3">
//                 <img
//                   src={imagePreviews.nicFrontPreview}
//                   alt="NIC Front Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>
  
//           <div className="col-md-6">
//             <label className="form-label" htmlFor="nicBack">
//               NIC Back
//             </label>
//             <input
//               id="nicBack"
//               type="file"
//               name="nicBack"
//               className="form-control"
//               onChange={handleFileChange}
//               accept="image/*"
//             />
//             {imagePreviews.nicBackPreview && (
//               <div className="mt-3">
//                 <img
//                   src={imagePreviews.nicBackPreview}
//                   alt="NIC Back Preview"
//                   className="preview-image"
//                   style={{ width: '250px', height: 'auto' }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
  
//         <div className="form-actions">
//           <button type="button" onClick={closeModal} disabled={isLoading}>
//             Close
//           </button>
//           <button type="submit" disabled={isLoading}>
//             {cus ? 'Update' : 'Save Changes'}
//           </button>
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         {isLoading && <div className="loading-message">Uploading Please Wait!</div>}
//       </form>
//     </div>
//   );
// };

// export default Form;



//check nic first version


import React, { useState, useEffect } from 'react';
import config from '../../config';

const Form = ({ closeModal, onSave, cus }) => {
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    nic: '',
    license: '',
    jobPosition: '',
    address: '',
    customerReview: '',
    customerDescription: '',
    nicFront: null,
    nicBack: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    nicFrontPreview: null,
    nicBackPreview: null,
  });

  useEffect(() => {
    if (cus) {
      setFormData({
        name: cus.cusName || '',
        phone: cus.cusPhone || '',
        nic: cus.nic || '',
        license: cus.license || '',
        jobPosition: cus.cusJob || '',
        address: cus.cusAddress || '',
        customerReview: cus.customerReview || '',
        customerDescription: cus.customerDescription || '',
      });

      // Set image previews if the customer has NIC images
      if (cus.nicFront || cus.nicBack) {
        setImagePreviews({
          nicFrontPreview: cus.nicFront ? `${config.BASE_URL}${cus.nicFront}` : null,
          nicBackPreview: cus.nicBack ? `${config.BASE_URL}${cus.nicBack}` : null
        });
      }
    }
  }, [cus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const compressImage = async (file, maxWidth = 1024, maxQuality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
  
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob((blob) => {
            if (!blob) {
              console.error("Canvas to Blob conversion failed");
              resolve(file); // Return original file if compression fails
              return;
            }
  
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
  
            resolve(compressedFile);
          }, 'image/jpeg', maxQuality);
        };
      };
      reader.onerror = () => {
        console.error('Error reading file');
        resolve(file); // Return original file if reading fails
      };
    });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files?.[0];

    if (file) {
      try {
        setIsLoading(true);
        const compressedFile = await compressImage(file);
        setFormData(prev => ({ ...prev, [name]: compressedFile }));
        
        const imageURL = URL.createObjectURL(compressedFile);
        setImagePreviews(prev => ({
          ...prev,
          [`${name}Preview`]: imageURL,
        }));
      } catch (err) {
        console.error("Image compression failed:", err);
        setFormData(prev => ({ ...prev, [name]: file }));
        const imageURL = URL.createObjectURL(file);
        setImagePreviews(prev => ({
          ...prev,
          [`${name}Preview`]: imageURL,
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required.';
    }

    return errors;
  };

  // Check if a customer with the same NIC already exists
  const checkNicExists = async (nic) => {
    if (!nic.trim()) return false;

    try {
      const response = await fetch(`${config.BASE_URL}/customer/check-nic/${nic}`);
      const data = await response.json();
      return response.ok && data.exists;
    } catch (error) {
      console.error('Error checking NIC:', error);
      return false;
    }
  };

  const handleSubmitCus = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isUpdate = !!cus;

      // Check if NIC already exists for new customers
      if (!isUpdate && formData.nic.trim()) {
        const nicExists = await checkNicExists(formData.nic);
        if (nicExists) {
          window.alert('Customer already exists with this NIC!');
          setIsLoading(false);
          return;
        }
      }

      // Create FormData for both customer data and images
      const formDataBody = new FormData();

      // Add all the customer data fields
      formDataBody.append('cusName', formData.name.trim());
      formDataBody.append('cusPhone', formData.phone.trim());
      formDataBody.append('cusAddress', formData.address.trim());

      if (formData.jobPosition) {
        formDataBody.append('cusJob', formData.jobPosition.trim());
      }

      if (formData.nic) {
        formDataBody.append('nic', formData.nic.trim());
      }

      if (formData.license) {
        formDataBody.append('license', formData.license.trim());
      }

      if (formData.customerReview) {
        formDataBody.append('customerReview', formData.customerReview);
      }

      if (formData.customerDescription) {
        formDataBody.append('customerDescription', formData.customerDescription.trim());
      }

      // Add files if they've been selected
      if (formData.nicFront instanceof File) {
        formDataBody.append('nicFront', formData.nicFront);
      }

      if (formData.nicBack instanceof File) {
        formDataBody.append('nicBack', formData.nicBack);
      }

      const url = isUpdate
        ? `${config.BASE_URL}/customer/${cus.cusId}`
        : `${config.BASE_URL}/customer`;

      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataBody,
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = 'Save Unsuccessful: An error occurred while saving the customer.';
        
        switch (response.status) {
          case 400:
            errorMessage = 'Save Unsuccessful: Please check the provided data and try again.';
            break;
          case 409:
            errorMessage = 'Save Unsuccessful: A customer with this information already exists.';
            break;
          case 413:
            errorMessage = 'Save Unsuccessful: The uploaded files are too large. Please use smaller files.';
            break;
        }
        
        setError(errorMessage);
        window.alert(errorMessage);
        return;
      }

      window.alert('Saved Successfully!');

      const updatedCustomer = isUpdate
        ? responseData.customer  // Use the customer returned from the server
        : responseData.newCustomer;

      onSave(updatedCustomer);
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = 'Save Unsuccessful: An unexpected error occurred. Please try again later.';
      setError(errorMessage);
      window.alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ placeItems: 'center' }}>
      <h2>{cus ? 'Edit Customer' : 'New Customer'}</h2>
      <form onSubmit={handleSubmitCus} autoComplete="off">
        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="name">
              Name <span>*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Full Name"
              className="form-control"
              required
              aria-describedby={formErrors.name ? 'name-error' : undefined}
            />
            {formErrors.name && (
              <span id="name-error" className="error-text">
                {formErrors.name}
              </span>
            )}
          </div>
  
          <div className="col-md-6">
            <label className="form-label" htmlFor="phone">
              Phone <span>*</span>
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Phone"
              required
              aria-describedby={formErrors.phone ? 'phone-error' : undefined}
            />
            {formErrors.phone && (
              <span id="phone-error" className="error-text">
                {formErrors.phone}
              </span>
            )}
          </div>
        </div>
  
        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="nic">
              NIC
            </label>
            <input
              id="nic"
              type="text"
              name="nic"
              className="form-control"
              value={formData.nic}
              onChange={handleChange}
              placeholder="Enter NIC"
            />
          </div>
  
          <div className="col-md-6">
            <label className="form-label" htmlFor="license">
              License
            </label>
            <input
              id="license"
              type="text"
              name="license"
              className="form-control"
              value={formData.license}
              onChange={handleChange}
              placeholder="Enter License"
            />
          </div>
        </div>
  
        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="jobPosition">
              Job Position
            </label>
            <input
              id="jobPosition"
              type="text"
              name="jobPosition"
              className="form-control"
              value={formData.jobPosition}
              onChange={handleChange}
              placeholder="Enter Job Position"
            />
          </div>
  
          <div className="col-md-6">
            <label className="form-label" htmlFor="address">
              Address <span>*</span>
            </label>
            <input
              id="address"
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              required
              aria-describedby={formErrors.address ? 'address-error' : undefined}
            />
            {formErrors.address && (
              <span id="address-error" className="error-text">
                {formErrors.address}
              </span>
            )}
          </div>
        </div>
  
        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="customerReview">
              Customer Review
            </label>
            <select
              id="customerReview"
              name="customerReview"
              className="form-control"
              value={formData.customerReview}
              onChange={handleChange}
            >
              <option value="">Select Review</option>
              <option value="Good">Good</option>
              <option value="Normal">Normal</option>
              <option value="Bad">Bad</option>
            </select>
          </div>
  
          <div className="col-md-6">
            <label className="form-label" htmlFor="customerDescription">
              Customer Description
            </label>
            <input
              id="customerDescription"
              type="text"
              name="customerDescription"
              className="form-control"
              value={formData.customerDescription}
              onChange={handleChange}
              placeholder="Enter Customer Description"
            />
          </div>
        </div>
  
        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="nicFront">
              NIC Front
            </label>
            <input
              id="nicFront"
              type="file"
              name="nicFront"
              className="form-control"
              onChange={handleFileChange}
              accept="image/*"
            />
            {imagePreviews.nicFrontPreview && (
              <div className="mt-3">
                <img
                  src={imagePreviews.nicFrontPreview}
                  alt="NIC Front Preview"
                  className="preview-image"
                  style={{ width: '250px', height: 'auto' }}
                />
              </div>
            )}
          </div>
  
          <div className="col-md-6">
            <label className="form-label" htmlFor="nicBack">
              NIC Back
            </label>
            <input
              id="nicBack"
              type="file"
              name="nicBack"
              className="form-control"
              onChange={handleFileChange}
              accept="image/*"
            />
            {imagePreviews.nicBackPreview && (
              <div className="mt-3">
                <img
                  src={imagePreviews.nicBackPreview}
                  alt="NIC Back Preview"
                  className="preview-image"
                  style={{ width: '250px', height: 'auto' }}
                />
              </div>
            )}
          </div>
        </div>
  
        <div className="form-actions mt-4">
          <button type="button" className="btn btn-secondary me-2" onClick={closeModal} disabled={isLoading}>
            Close
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Processing...' : (cus ? 'Update' : 'Save Changes')}
          </button>
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {isLoading && <div className="alert alert-info mt-3">Uploading Please Wait!</div>}
      </form>
    </div>
  );
};

export default Form;