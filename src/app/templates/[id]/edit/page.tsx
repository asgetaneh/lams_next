// src/app/templates/[id]/edit/page.tsx
 import  prisma  from '@/lib/prisma';
import { updateTemplateAction } from '@/app/templates/updateTemplate';
import TemplateForm from '@/app/templates/TemplateForm';
// src/app/templates/[id]/edit/page.tsx
import { notFound } from 'next/navigation';// src/app/templates/[id]/edit/page.tsx

 import TemplateFormWrapper from './form-wrapper';

type EditTemplatePageProps = {
  params: { id: string };
};

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const template = await prisma.templates.findUnique({
    where: { template_id: params.id },
  });

  if (!template) return notFound();

  return (
    <TemplateFormWrapper
      templateId={params.id}
      initialData={{
        name: template.template_name,
        content: template.html_content,
      }}
    />
  );
}
