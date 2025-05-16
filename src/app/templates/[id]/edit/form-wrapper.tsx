// src/app/templates/[id]/edit/form-wrapper.tsx
import { updateTemplateAction } from '@/app/templates/updateTemplate';
import TemplateForm from '@/app/templates/TemplateForm';

type TemplateFormWrapperProps = {
  templateId: string;
  initialData: {
    name: string;
    content: string;
  };
};

export default function TemplateFormWrapper({
  templateId,
  initialData,
}: TemplateFormWrapperProps) {
  async function handleSubmit(formData: FormData) {
    'use server';
    return updateTemplateAction(templateId, formData);
  }

  return (
    <TemplateForm
      initialData={initialData}
      action={handleSubmit}
      submitLabel="Update Template"
    />
  );
}
