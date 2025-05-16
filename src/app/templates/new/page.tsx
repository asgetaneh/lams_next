import TemplateForm from '@/app/templates/TemplateForm';
 
import { createTemplate } from '@/app/templates/actions';
 
export default function NewTemplatePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Template</h1>
      <TemplateForm action={createTemplate} submitLabel="Create" />
    </div>
  );
}




// 'use client';
// import { useState, useEffect } from 'react';
// import TemplateEditor from '../TemplateEditor';
// import { useRouter } from 'next/navigation'


// export default function TemplateNewPage() {
//   const [templateName, setTemplateName] = useState('');
//   const [selectedType, setSelectedType] = useState('');
//   const [htmlContent, setHtmlContent] = useState('');
//   const [letterTypes, setLetterTypes] = useState([]);
//   const router = useRouter()
  

//   useEffect(() => {
//     fetch('/api/letter-types')
//       .then((res) => res.json())
//       .then(setLetterTypes);
//   }, []);

//   const handleSave = async () => {  
//     try {
//       const response = await fetch('/api/templates', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           letter_type_id: selectedType,
//           template_name: templateName,
//           html_content: htmlContent,
//         }),
//       });
//       const data = await response.json(); // Assuming the API sends a response body
//       console.log("Full API response:", data); // Debug the entire object
//       //alert(data.success || "No 'success' key found. Actual response: " + JSON.stringify(data));
//       if (!response.ok) {
//         // If response status is not OK, throw an error
//         throw new Error(`Failed to save template and: ${response.statusText}`);
//       }
  
     
  
//       if (data.html_content) {
//         alert('Template saved successfully!');
//         router.push('/templates')
//       } else {
//         alert('Failed to save template!');
//       }
//     } catch (error) {
//       // Handle any errors (e.g., network issues)
//       console.error('Error saving template:', error);
//       alert('An error occurred while saving the template.');
//     }
//   };
  

//   return (
//     <div className="p-6 space-y-4">
//       <h2 className="text-xl font-bold">New Letter Template</h2>
//       <input
//         className="border p-2 w-full"
//         placeholder="Template Name"
//         value={templateName}
//         onChange={(e) => setTemplateName(e.target.value)}
//       />
//       <select
//         className="border p-2 w-full"
//         onChange={(e) => setSelectedType(e.target.value)}
//         value={selectedType}
//       >
//         <option value="">Select Letter Type</option>
//         {letterTypes.map((type) => (
//           <option key={type.letter_type_id} value={type.letter_type_id}>
//             {type.type_name}
//           </option>
//         ))}
//       </select>

//       <TemplateEditor content={htmlContent} onChange={setHtmlContent} />
      



//       <button
//         onClick={handleSave}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Save Template
//       </button>
//     </div>
//   );
// }
