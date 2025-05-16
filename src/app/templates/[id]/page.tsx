// app/templates/[id]/page.tsx

import { notFound } from 'next/navigation';
import  prisma  from '@/lib/prisma';
import Link from 'next/link';

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const id = params.id;

  const template = await prisma.templates.findUnique({
    where: { template_id: id }, // ✅ Use string directly
  });

  if (!template) return notFound();

  const letterTypes = await prisma.letter_Types.findMany({
    where: { is_active: true },
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Template</h1>

      <form action={`/api/templates/${id}/update`} method="POST" className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Template Name</label>
          <input
            name="template_name"
            defaultValue={template.template_name}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Letter Type</label>
          <select
            name="letter_type_id"
            defaultValue={template.letter_type_id}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            {letterTypes.map((type) => (
              <option key={type.letter_type_id} value={type.letter_type_id}>
                {type.type_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">HTML Content</label>
          <textarea
            name="html_content"
            rows={10}
            defaultValue={template.html_content}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="flex justify-between items-center">
          <Link href="/templates" className="text-sm text-gray-500 hover:underline">
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
