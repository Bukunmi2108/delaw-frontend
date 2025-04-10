import React from 'react';
import './MultiForm.css';
import useMultiFormField from '../../hooks/useMultiFormField';

interface FieldSchema {
  type: string;
  label: string;
  description?: string;
}

interface MultiFormProps {
  formInterface: Record<string, FieldSchema>;
  formData: Record<string, any>;
  onInputChange: (name: string, value: any) => void;
  onSubmit: (formData: Record<string, any>) => void;
  onGoBack: () => void;
  currentStep: number;
  totalSteps: number;
}

function MultiForm({
  formInterface,
  formData,
  onInputChange,
  onSubmit,
  onGoBack,
  currentStep,
  totalSteps,
}: MultiFormProps) {
  const fields = Object.keys(formInterface);
  const fieldsPerPage = 3;

  const {
    currentFieldIndex,
    displayedFieldsStartIndex,
    isFirstPage,
    isLastPage,
    handleNext,
    handlePrevious,
  } = useMultiFormField({
    totalFields: fields.length,
    fieldsPerPage,
    onFormComplete: () => onSubmit(formData),
  });

  const displayedFields = fields.slice(displayedFieldsStartIndex, displayedFieldsStartIndex + fieldsPerPage);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onInputChange(name, value);
  };

  return (
    <form className='multistep-form' onSubmit={(e) => e.preventDefault()}>
      <h2 className='multistep-form-title'>Fill in the Details</h2>
      {displayedFields.map((key) => (
        <div className='input-group' key={key}>
          <label htmlFor={key}>{formInterface[key].label}</label>
          <input
            type={formInterface[key].type === 'number' ? 'number' : 'text'}
            id={key}
            name={key}
            value={formData[key] !== undefined ? formData[key]?.toString() : ''}
            onChange={handleChange}
            required
          />
          {formInterface[key].description && (
            <small>{formInterface[key].description}</small>
          )}
        </div>
      ))}

      <div className='multistep-btns' style={{ marginTop: '20px' }}>
        {currentStep > 1 && isFirstPage && (
          <button type="button" onClick={onGoBack}>
            Back to Template
          </button>
        )}
        {!isFirstPage && (
          <button type="button" onClick={handlePrevious}>
            Previous
          </button>
        )}
        {!isLastPage && (
          <button type="button" onClick={handleNext}>
            Next
          </button>
        )}
        {isLastPage && (
          <button type="button" onClick={handleNext}>
            Continue to Editor
          </button>
        )}
      </div>
      {/* <p className='multistep-indicator'>Step {currentStep + 1} of {totalSteps}</p> */}
      <p className='field-page-indicator'>
        Page {Math.floor(currentFieldIndex / fieldsPerPage) + 1} of {Math.ceil(fields.length / fieldsPerPage)}
      </p>
    </form>
  );
}

export default MultiForm;