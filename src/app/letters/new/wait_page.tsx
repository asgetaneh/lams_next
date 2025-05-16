'use client'// components/WriteLetter.tsx

import { useEffect, useState } from "react";

export default function WriteLetter() {
  const [letterTypes, setLetterTypes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch("/api/letterTypes")
      .then((res) => res.json())
      .then(setLetterTypes);
  }, []);

  useEffect(() => {
    if (selectedType)
      fetch(`/api/templates/${selectedType}`)
        .then((res) => res.json())
        .then(setTemplates);
  }, [selectedType]);

  useEffect(() => {
    const template = templates.find((t) => t.template_id === selectedTemplate);
    if (template) {
      setTemplateContent(template.html_content);
    }
  }, [selectedTemplate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filledTemplate = templateContent.replace(
    /{{(.*?)}}/g,
    (_, key) => formData[key.trim()] || `<em>[${key.trim()}]</em>`
  );

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div>
        <h3>Write Letter</h3>
        <select
          className="border p-2 w-full"
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option>Select Letter Type</option>
          {letterTypes.map((type) => (
            <option key={type.letter_type_id} value={type.letter_type_id}>
              {type.type_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 w-full mt-2"
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option>Select Template</option>
          {templates.map((t) => (
            <option key={t.template_id} value={t.template_id}>
              {t.template_name}
            </option>
          ))}
        </select>

        {/* Dynamic fields based on placeholders */}
        {Array.from(templateContent.matchAll(/{{(.*?)}}/g)).map(([match, key]) => (
          <input
            key={key}
            placeholder={key.trim()}
            className="border p-2 mt-2 w-full"
            value={formData[key.trim()] || ""}
            onChange={(e) => handleInputChange(key.trim(), e.target.value)}
          />
        ))}
      </div>

      <div>
        <h3>Live Letter Preview</h3>
        <div
          className="border p-4 bg-white min-h-[200px]"
          dangerouslySetInnerHTML={{ __html: filledTemplate }}
        />
      </div>
    </div>
  );
}
