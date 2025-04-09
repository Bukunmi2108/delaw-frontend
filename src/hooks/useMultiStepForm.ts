import React, { useState, useEffect } from 'react';
import { FormValues } from './useFormSchema'; // Adjust path as needed

interface UseMultiStepFormProps<T extends Record<string, any>> {
  formInterface: T;
  onSubmit: (data: FormValues<T>) => void;
  fieldsPerPage?: number;
}

function useMultiStepForm<T extends Record<string, any>>({
  formInterface,
  onSubmit,
  fieldsPerPage = 3,
}: UseMultiStepFormProps<T>) {
  const fieldKeys = Object.keys(formInterface);
  const totalSteps = Math.ceil(fieldKeys.length / fieldsPerPage);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormValues<T>>({} as FormValues<T>);

  useEffect(() => {
    // Initialize formData with default values based on the formInterface
    const initialData: Partial<FormValues<T>> = {};
    for (const key in formInterface) {
      const type = formInterface[key];
      if (type === 'string') {
        initialData[key] = undefined;
      } else if (type === 'number | undefined') {
        initialData[key] = undefined;
      } else if (type === 'boolean | undefined') {
        initialData[key] = undefined;
      } else if (type === 'Date | undefined') {
        initialData[key] = undefined;
      } else {
        initialData[key] = undefined;
      }
    }
    setFormData(initialData as FormValues<T>);
  }, [formInterface]);

  const displayedFields = fieldKeys.slice(
    currentStep * fieldsPerPage,
    (currentStep + 1) * fieldsPerPage
  );

  const goToNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    let newValue: string | number | boolean | Date | undefined | any;

    if (type === 'checkbox') {
      newValue = (event.target as HTMLInputElement).checked; // Type assertion to HTMLInputElement
    } else if (type === 'number') {
      newValue = value === '' ? undefined : parseFloat(value);
    } else if (formInterface[name] === 'Date | undefined') {
      newValue = value === '' ? undefined : new Date(value);
    } else {
      newValue = value;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return {
    currentStep,
    totalSteps,
    displayedFields,
    formData,
    goToNextStep,
    goToPreviousStep,
    handleInputChange,
    handleSubmit,
  };
}

export default useMultiStepForm;