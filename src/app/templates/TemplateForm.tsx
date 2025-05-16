// components/TemplateForm.tsx
'use client';

import { useState } from 'react';
import TiptapEditor from './RichTextEditor';

type TemplateFormProps = {
  initialData?: {
    name: string;
    content: string;
  };
  action: (formData: FormData) => void;
  submitLabel: string;
};

export default function TemplateForm({
  initialData,
  action,
  submitLabel,
}: TemplateFormProps) {
  const [htmlContent, setHtmlContent] = useState(initialData?.content || '');

  return (
    <form
      action={(formData) => {
        formData.set('content', htmlContent); // override textarea content
        action(formData);
      }}
      className="space-y-4"
    >
      <div>
        <label>Name</label>
        <input
          name="name"
          defaultValue={initialData?.name}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Content</label>
        <TiptapEditor content={htmlContent} onChange={setHtmlContent} />
        <textarea
          name="content"
          value={htmlContent}
          readOnly
          hidden
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {submitLabel}
      </button>
    </form>
  );
}
