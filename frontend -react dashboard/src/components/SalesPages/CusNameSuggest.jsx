import React, { useState, useEffect, useRef } from 'react';
import config from '../../config';

const CusNameSuggest = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCustomerSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `${config.BASE_URL}/customers/suggestion?name=${encodeURIComponent(searchTerm)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching customer suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCustomerSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelectCustomer = (customer) => {
    onSelectCustomer(customer);
    setSearchTerm(customer.cusName);
    setShowSuggestions(false);
  };

  return (
    <div className="position-relative" ref={wrapperRef}>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Customer Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 z-3 bg-secondary">
          {suggestions.map((customer) => (
            <li
              key={customer.cusId}
              className="list-group-item list-group-item-action cursor-pointer"
              onClick={() => handleSelectCustomer(customer)}
            >
              {customer.cusName} - {customer.nic} - {customer.cusAddress}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CusNameSuggest;