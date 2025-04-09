import useFormSchema from '../../hooks/useFormSchema';
import useMultiStepForm from '../../hooks/useMultiStepForm';
import './MultiForm.css'

interface FieldSchema {
    type: string;
    label: string;
    description?: string;
}

interface BackendResponse {
    name: string;
    description: string;
    category_id: string;
    id: string;
    created_at: string;
    fields_schema: Record<string, FieldSchema>;
}
// Example backend response (replace with your actual data)
const backendResponse: BackendResponse = {
  "name": "Invoice1",
  "description": "This is another template for an invoice",
  "category_id": "0aa4b5a7-900e-4434-a4ae-e53d924e7caa",
  "id": "bde254e7-2733-4281-bfdf-23aed0baa63b",
  "created_at": "2025-04-09T13:44:58.966208",
  "fields_schema": {
    "notes": { "type": "string", "label": "Notes", "description": "What is this invoice about?" },
    "currency": { "type": "string", "label": "Currency", "description": "..." },
    "subtotal": { "type": "string", "label": "Subtotal", "description": "..." },
    "tax_rate": { "type": "string", "label": "Tax Rate (%)", "description": "..." },
    "your_city": { "type": "string", "label": "Your City", "description": "..." },
    "tax_amount": { "type": "string", "label": "Tax", "description": "..." },
    "your_state": { "type": "string", "label": "Your State", "description": "..." },
    "client_city": { "type": "string", "label": "Client City", "description": "..." },
    "client_name": { "type": "string", "label": "Client Name", "description": "..." },
    "client_state": { "type": "string", "label": "Client State", "description": "..." },
    "invoice_date": { "type": "string", "label": "Date", "description": "..." },
    "total_amount": { "type": "string", "label": "Total", "description": "..." },
    "your_country": { "type": "string", "label": "Your Country", "description": "..." },
    "client_country": { "type": "string", "label": "Client Country", "description": "..." },
    "invoice_number": { "type": "string", "label": "Invoice Number", "description": "..." },
    "your_postal_code": { "type": "string", "label": "Your Postal Code", "description": "..." },
    "your_company_name": { "type": "string", "label": "Your Company Name", "description": "..." },
    "client_postal_code": { "type": "string", "label": "Client Postal Code", "description": "..." },
    "your_address_line1": { "type": "string", "label": "Your Address Line 1", "description": "..." },
    "your_address_line2": { "type": "string", "label": "Your Address Line 2", "description": "..." },
    "client_address_line1": { "type": "string", "label": "Client Address Line 1", "description": "..." },
    "client_address_line2": { "type": "string", "label": "Client Address Line 2", "description": "..." }
  }
};

function MultiForm() {
  const { formInterface } = useFormSchema(backendResponse.fields_schema);
  const {
    currentStep,
    totalSteps,
    displayedFields,
    formData,
    goToNextStep,
    goToPreviousStep,
    handleInputChange,
    handleSubmit,
  } = useMultiStepForm({
    formInterface,
    onSubmit: (data) => {
      console.log('Form Data to Backend:', data);
      // Here you would typically send 'data' to your backend
      alert('Form submitted! Check console.');
    },
  });

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form className='multistep-form' onSubmit={currentStep === totalSteps - 1 ? handleFinalSubmit : handleNext}>
      <h2 className='multistep-form-title'>Invoice Form (Multi-Step)</h2>
      {displayedFields.map((key) => (
        <div className='input-group' key={key}>
          <label htmlFor={key}>{backendResponse.fields_schema[key].label}</label>
          <input
            type={backendResponse.fields_schema[key].type === 'number' ? 'number' : 'text'}
            id={key}
            name={key}
            value={formData[key] !== undefined ? formData[key]?.toString() : ''}
            onChange={handleInputChange}
            required
          />
          {backendResponse.fields_schema[key].description && (
            <small>{backendResponse.fields_schema[key].description}</small>
          )}
        </div>
      ))}

      <div className='multistep-btns' style={{ marginTop: '20px' }}>
        {currentStep > 0 && (
          <button type="button" onClick={goToPreviousStep}>
            Back
          </button>
        )}
        {currentStep < totalSteps - 1 ? (
          <button type="submit" onClick={goToNextStep}>
            Next
          </button>
        ) : (
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
      <p className='multistep-indicator'>Step {currentStep + 1} of {totalSteps}</p>
    </form>
  );
}

export default MultiForm;