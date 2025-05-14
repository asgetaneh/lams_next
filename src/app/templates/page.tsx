// app/templates/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Letter_Types, Templates } from '@prisma/client';

const prisma = new PrismaClient();

export default async function TemplatesPage() {
  const templates: (Templates & { letter_type: Letter_Types })[] =
    await prisma.templates.findMany({
      include: {
        letter_type: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

  const letterTypes: Letter_Types[] = await prisma.letter_Types.findMany({
    where: {
      is_active: true,
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Letter Templates</h1>
        <Link
          href="/templates/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Template
        </Link>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Letter Type
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Last Updated
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {templates.map((template) => (
              <tr key={template.template_id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {template.template_name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {template.letter_type.type_name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(template.updated_at).toLocaleDateString()}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link
                    href={`/templates/${template.template_id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/letters/new?template=${template.template_id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Use
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
