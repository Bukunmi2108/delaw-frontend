import { marked } from 'marked';
import { useState, useEffect, useCallback } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Category {
  id: string;
  name: string;
}

interface Template {
  id: string;
  name: string;
}

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

interface UseMultiDocumentFormProps {
  fetchCategories: () => Promise<Category[]>;
  fetchTemplates: (categoryId: string) => Promise<Template[]>;
  fetchFormSchema: (templateId: string) => Promise<BackendResponse | null>;
  fetchMarkdown: (templateId: string, formData: Record<string, any>) => Promise<string | null>;
  onFinalSubmit: (editorContent: string) => void;
  editor: any | null;
}

interface MultiDocumentFormState {
  currentStep: number;
  categories: Category[];
  selectedCategory: string;
  templates: Template[];
  selectedTemplate: string;
  formSchema: BackendResponse | null;
  formData: Record<string, any>;
  editorContent: string;
  loadingCategories: boolean;
  loadingTemplates: boolean;
  loadingSchema: boolean;
  loadingMarkdown: boolean;
  errorCategories: string | null;
  errorTemplates: string | null;
  errorSchema: string | null;
  errorMarkdown: string | null;
}

interface MultiDocumentFormActions {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleCategoryChange: (categoryId: string) => void;
  handleTemplateSelect: (templateId: string) => void;
  handleFormInputChange: (name: string, value: any) => void;
  handleFormSubmit: (formData: Record<string, any>) => void;
  handleEditorChange: (content: string) => void;
  handleDocumentExport: (format: 'docx' | 'pdf') => Promise<void>; 
}

const useMultiDocumentForm = ({
  fetchCategories,
  fetchTemplates,
  fetchFormSchema,
  fetchMarkdown,
  editor,
}: UseMultiDocumentFormProps): [MultiDocumentFormState, MultiDocumentFormActions] => {
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formSchema, setFormSchema] = useState<BackendResponse | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editorContent, setEditorContent] = useState('<p></p>');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [loadingMarkdown, setLoadingMarkdown] = useState(false);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [errorTemplates, setErrorTemplates] = useState<string | null>(null);
  const [errorSchema, setErrorSchema] = useState<string | null>(null);
  const [errorMarkdown, setErrorMarkdown] = useState<string | null>(null);

  const totalSteps = 4;

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        setErrorCategories(error.message || 'Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const loadTemplates = async (categoryId: string) => {
      if (!categoryId) {
        setTemplates([]);
        return;
      }
      setLoadingTemplates(true);
      setErrorTemplates(null);
      try {
        const fetchedTemplates = await fetchTemplates(categoryId);
        setTemplates(fetchedTemplates);
        setSelectedTemplate('');
        setCurrentStep(1);
      } catch (error: any) {
        console.error(`Error fetching templates for category ${categoryId}:`, error);
        setErrorTemplates(error.message || 'Failed to load templates.');
        setTemplates([]);
      } finally {
        setLoadingTemplates(false);
      }
    };

    if (currentStep === 0 && selectedCategory) {
      loadTemplates(selectedCategory);
    } else if (currentStep > 0 && !selectedCategory) {
      setTemplates([]);
      setCurrentStep(0);
    }
  }, [selectedCategory, fetchTemplates, currentStep]);

  useEffect(() => {
    const loadFormSchema = async (templateId: string) => {
      if (!templateId) {
        setFormSchema(null);
        return;
      }
      setLoadingSchema(true);
      setErrorSchema(null);
      try {
        const schema = await fetchFormSchema(templateId);
        setFormSchema(schema);
        setFormData({});
        setCurrentStep(2);
      } catch (error: any) {
        console.error(`Error fetching schema for template ${templateId}:`, error);
        setErrorSchema(error.message || 'Failed to load form schema.');
        setFormSchema(null);
      } finally {
        setLoadingSchema(false);
      }
    };

    if (currentStep === 1 && selectedTemplate) {
      loadFormSchema(selectedTemplate);
    } else if (currentStep > 1 && !selectedTemplate) {
      setFormSchema(null);
      setFormData({});
      setCurrentStep(1);
    }
  }, [selectedTemplate, fetchFormSchema, currentStep]);

  const loadMarkdown = async (templateId: string, currentFormData: Record<string, any>) => {
    if (!templateId || Object.keys(currentFormData).length === 0) {
      setEditorContent('<p></p>');
      return;
    }
    setLoadingMarkdown(true);
    setErrorMarkdown(null);
    try {
      const markdownContent = await fetchMarkdown(templateId, currentFormData);

      // console.log(markdownContent)

      let parsedMarkdownHTML = '<p></p>'; 
      if (markdownContent) {
        try {
          parsedMarkdownHTML = marked.parse(markdownContent) as string;
          // console.log(parsedMarkdownHTML)
        } catch (error) {
          console.error("Error parsing Markdown:", error);
          // Optionally set an error state or a user-friendly message
        }
      }
    
      setEditorContent(parsedMarkdownHTML);
      // console.log(editorContent)
      setCurrentStep(3);
    } catch (error: any) {
      console.error(`Error fetching markdown for template ${templateId}:`, error);
      setErrorMarkdown(error.message || 'Failed to load document content.');
      setEditorContent('<p></p>');
    } finally {
      setLoadingMarkdown(false);
    }
  };

  useEffect(() => {
    if (currentStep === 2 && selectedTemplate && Object.keys(formData).length > 0) {
      // Do not load markdown directly here, wait for handleFormSubmit
    } else if (currentStep > 2 && (!selectedTemplate || Object.keys(formData).length === 0)) {
      setEditorContent('<p></p>');
      setCurrentStep(2);
    } else if (currentStep === 3 && editorContent === '<p></p>' && selectedTemplate && Object.keys(formData).length > 0) {
      loadMarkdown(selectedTemplate, formData);
    }
  }, [selectedTemplate, formData, fetchMarkdown, currentStep, editorContent]);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps - 1));
  }, [totalSteps]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setTemplates([]);
    setSelectedTemplate('');
    setCurrentStep(0);
  }, []);

  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    // The useEffect for form schema will handle moving to the next step
  }, []);

  const handleFormInputChange = useCallback((name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleFormSubmit = useCallback((completedFormData: Record<string, any>) => {
    // Receive the completed form data from MultiForm
    if (selectedTemplate) {
      loadMarkdown(selectedTemplate, completedFormData);
    } else {
      console.warn("Template not selected, cannot fetch markdown.");
    }
  }, [selectedTemplate, fetchMarkdown]);

  const handleEditorChange = useCallback((content: string) => {
    setEditorContent(content);
  }, []);

  const handleDocumentExport = useCallback(async (format: 'docx' | 'pdf') => {
    if (!editorContent) {
      console.warn("Editor instance not available for export.");
      return;
    }

    if (!editor) {
      console.warn("Editor instance not available for PDF export.");
      return;
    }

    if (format === 'docx') {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(editor.getText()), // Use the Text constructor directly
                ],
              }),
            ],
          },
        ],
      });
    
      try {
        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        saveAs(blob, 'document.docx');
      } catch (error) {
        console.error('Error exporting to DOCX:', error);
        alert('Error exporting to DOCX');
      }
    } else if (format === 'pdf') {
      const editorContentElement = document.querySelector('.ProseMirror') as HTMLElement; // Adjust selector if needed

      if (editorContentElement) {
        try {
          const canvas = await html2canvas(editorContentElement, {
            scrollX: 0,
            scrollY: -window.scrollY,
          });
          const imgData = canvas.toDataURL('image/png');

          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('document.pdf');
        } catch (error) {
          console.error('Error exporting to PDF:', error);
          alert('Error exporting to PDF');
        }
      } else {
        alert('Could not find editor content to export to PDF.');
      }
    }
  }, [editorContent, editor]);

  return [
    {
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
    },
    {
      goToNextStep,
      goToPreviousStep,
      handleCategoryChange,
      handleTemplateSelect,
      handleFormInputChange,
      handleFormSubmit,
      handleEditorChange,
      handleDocumentExport,
    },
  ];
};

export default useMultiDocumentForm;