'use client';
import { useState } from 'react';

export default function UploadTemplate() {
  const [file, setFile] = useState<File | null>(null);

  const uploadTemplate = async () => {
    const formData = new FormData();
    formData.append('file', file!);
    formData.append('template_name', 'Official Letter');
    formData.append('letter_type_id', 'LETTER_TYPE_UUID');

    const response = await fetch('/api/templates/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    console.log('Template saved:', result);
  };

  return (
    <div>
      <input type="file" accept=".docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={uploadTemplate}>Upload Template</button>
    </div>
  );
}