import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const navigate = useNavigate();
  
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/events?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={handleChange}
          className="w-full p-3 pl-10 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          placeholder="Busca por su nombre o lugar"
        />
        <button
          type="submit"
          className="absolute right-2 bottom-2 top-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg text-sm px-4 py-1.5"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;