import { useState, useRef, useEffect } from 'react';
import './Word.css';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DocumentEditor, WordExport } from '@syncfusion/ej2-documenteditor';

// Inject required modules
DocumentEditorContainerComponent.Inject(Toolbar, WordExport);

function Word() {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const editorContainerRef = useRef<DocumentEditorContainerComponent>(null);

  // Add resize observer
  useEffect(() => {
    const handleResize = () => {
      const editor = editorContainerRef.current?.documentEditor;
      editor?.resize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const exportDocument = (format: 'DOCX' | 'TXT') => {
    const editor = editorContainerRef.current?.documentEditor as DocumentEditor;
    
    if (editor) {
        if (format === 'DOCX') {
        editor.save('document.docx', 'Docx');
      } else {
        editor.save('document.txt', 'Txt');
      }
    }
    setShowExportOptions(false);
  };

  return (
    <div className="word-container">
      <div className="toolbar-container">
        <h2>CaseSimpli Editor</h2>
        <div className="export-wrapper">
          <ButtonComponent
            cssClass="e-btn e-primary modern-export-button"
            onClick={() => setShowExportOptions(!showExportOptions)}
          >
            Export
            <span className="e-caret"></span>
          </ButtonComponent>

          {showExportOptions && (
            <div className="modern-export-dropdown">
              <button
                className="export-option"
                onClick={() => exportDocument('DOCX')}
              >
                Export as DOCX
              </button>
              <button
                className="export-option"
                onClick={() => exportDocument('TXT')}
              >
                Export as Text
              </button>
            </div>
          )}
        </div>
      </div>

      <DocumentEditorContainerComponent 
        ref={editorContainerRef}
        id="container"
        style={{ 'height': '100%' }}
        serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
        enableToolbar={true}
      />
    </div>
  );
}

export default Word;