// src/context/FormDataContext.js
import React, { createContext, useContext, useState } from 'react';
import { useFormData } from '../../components/FormContext/FormContext';

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    latitude: null,
    longitude: null,
    experience: '',
    rating: '',
    reviews: '',
    about: '',
    avatar: '',
    services: [{ title: '', price: '' }],
    skills: [''],
    availability: [],
  });

  const updateFormData = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => useContext(FormDataContext);

