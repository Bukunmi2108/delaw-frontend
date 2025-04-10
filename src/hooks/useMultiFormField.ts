import { useState } from 'react';

interface UseMultiFormFieldProps {
  totalFields: number;
  fieldsPerPage: number;
  onFormComplete: () => void;
}

interface UseMultiFormFieldResult {
  currentFieldIndex: number;
  displayedFieldsStartIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  handleNext: (e: React.FormEvent) => void;
  handlePrevious: () => void;
}

const useMultiFormField = ({
  totalFields,
  fieldsPerPage,
  onFormComplete,
}: UseMultiFormFieldProps): UseMultiFormFieldResult => {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);

  const displayedFieldsStartIndex = currentFieldIndex;
  const isFirstPage = currentFieldIndex === 0;
  const isLastPage = currentFieldIndex + fieldsPerPage >= totalFields;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastPage) {
      setCurrentFieldIndex((prev) => prev + fieldsPerPage);
    } else {
      onFormComplete();
    }
  };

  const handlePrevious = () => {
    if (!isFirstPage) {
      setCurrentFieldIndex((prev) => prev - fieldsPerPage);
    }
  };

  return {
    currentFieldIndex,
    displayedFieldsStartIndex,
    isFirstPage,
    isLastPage,
    handleNext,
    handlePrevious,
  };
};

export default useMultiFormField;