import React from 'react';
import './TemplateList.css'; 

interface Template {
  id: string;
  name: string;
  description?: string;
//   imageUrl?: string; // Example: URL to a thumbnail
}

interface TemplateListProps {
  templates: Template[];
  onSelect: (templateId: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ templates, onSelect }) => {
  return (
    <div className="template-list-container">
      {templates.map((template) => (
        <div
          key={template.id}
          className="template-item"
          onClick={() => onSelect(template.id)}
        >
          <div className="template-info">
            <h3 className="template-name">{template.name}</h3>
            {template.description && (
              <p className="template-description">{(template.description).substring(0, 120 - 3)}...</p>
            )}
          </div>
        </div>
      ))}
      {templates.length === 0 && <p>No templates available for this category.</p>}
    </div>
  );
};

export default TemplateList;