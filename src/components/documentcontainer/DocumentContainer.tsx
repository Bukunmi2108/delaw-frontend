import { Editor, MultiForm, Select, TemplateList } from '../../components';
import useMultiDocumentForm from '../../hooks/useMultiDocumentForm';
import apiService from '../../api/api';
import './DocumentContainer.css';

const DocumentContainerWithMultiForm = () => {
  const [state, actions] = useMultiDocumentForm({
    fetchCategories: apiService.getAllCategories,
    fetchTemplates: apiService.getTemplatesByCategory,
    fetchFormSchema: apiService.getFormSchemaByTemplate,
    fetchMarkdown: apiService.getMarkdownByTemplateAndData,
    onFinalSubmit: (editorContent) => {
      console.log('Final Editor Content for Export:', editorContent);
      alert('Document ready for export (check console)');
      // Implement your export logic here
    },
  });

  const {
    currentStep,
    categories,
    selectedCategory,
    templates,
    selectedTemplate,
    formSchema,
    formData,
    editorContent,
    loadingCategories,
    loadingTemplates,
    loadingSchema,
    loadingMarkdown,
    errorCategories,
    errorTemplates,
    errorSchema,
    errorMarkdown,
  } = state;

  const {
    goToNextStep,
    goToPreviousStep,
    handleCategoryChange,
    handleTemplateSelect,
    handleFormInputChange,
    handleFormSubmit,
    handleEditorChange,
    handleDocumentExport,
  } = actions;

  const steps = ['Select Category', 'Choose Template', 'Fill Form', 'Edit Document'];

  return (
    <div className="document-container">
      {/* Navigation */}
      <div className="multi-form-navigation">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`nav-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>

      <div className='multi-form-container'>
        {currentStep === 0 && (
          <div className='template-select-container'>
            <Select
              label="Choose a Document Category:"
              onChange={handleCategoryChange}
            />
            {loadingCategories && <p>Loading categories...</p>}
            {errorCategories && <p className="error">{errorCategories}</p>}
          </div>
        )}

        {currentStep === 1 && templates.length > 0 && (
          <div className='templatelist-container'>
            <h2>Choose a Template</h2>
            <TemplateList templates={templates} onSelect={handleTemplateSelect} />
            {loadingTemplates && <p>Loading templates...</p>}
            {errorTemplates && <p className="error">{errorTemplates}</p>}
            <button type="button" className='back-btn' onClick={goToPreviousStep}>
              - Back to Category
            </button>
          </div>
        )}

        {currentStep === 2 && formSchema && (
          <div className='multi-mini-form-container'>
            <MultiForm
              formInterface={formSchema.fields_schema}
              formData={formData}
              onInputChange={handleFormInputChange}
              onSubmit={handleFormSubmit}
              onGoBack={goToPreviousStep}
              currentStep={currentStep}
              totalSteps={4}
            />
            {loadingSchema && <p>Loading form fields...</p>}
            {errorSchema && <p className="error">{errorSchema}</p>}
          </div>
        )}

        {currentStep === 3 && formSchema && (
          <div className='editor-container'>
            <h2>Edit Document</h2>
            <Editor content={editorContent} onChange={handleEditorChange} />
            {loadingMarkdown && <p>Loading document content...</p>}
            {errorMarkdown && <p className="error">{errorMarkdown}</p>}
            <div className="form-actions" style={{ marginTop: '20px' }}>
              <button type="button" onClick={goToPreviousStep}>
                Back to Form
              </button>
              <button type="button" onClick={handleDocumentExport}>
                Export Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentContainerWithMultiForm;