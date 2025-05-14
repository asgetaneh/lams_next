'use client';
import { useState, useEffect } from 'react';
import TemplateEditor from '../TemplateEditor';

export default function TemplateNewPage() {
  const [templateName, setTemplateName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [letterTypes, setLetterTypes] = useState([]);

  useEffect(() => {
    fetch('/api/letter-types')
      .then((res) => res.json())
      .then(setLetterTypes);
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letter_type_id: selectedType,
          template_name: templateName,
          html_content: htmlContent,
        }),
      });
  
      if (!response.ok) {
        // If response status is not OK, throw an error
        throw new Error(`Failed to save template: ${response.statusText}`);
      }
  
      const data = await response.json(); // Assuming the API sends a response body
  
      if (data.success) {
        alert('Template saved successfully!');
      } else {
        alert('Failed to save template!');
      }
    } catch (error) {
      // Handle any errors (e.g., network issues)
      console.error('Error saving template:', error);
      alert('An error occurred while saving the template.');
    }
  };
  

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">New Letter Template</h2>
      <input
        className="border p-2 w-full"
        placeholder="Template Name"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
      />
      <select
        className="border p-2 w-full"
        onChange={(e) => setSelectedType(e.target.value)}
        value={selectedType}
      >
        <option value="">Select Letter Type</option>
        {letterTypes.map((type) => (
          <option key={type.letter_type_id} value={type.letter_type_id}>
            {type.type_name}
          </option>
        ))}
      </select>

      <TemplateEditor content={htmlContent} onChange={setHtmlContent} />
      



      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Template
      </button>
    </div>
  );
}
