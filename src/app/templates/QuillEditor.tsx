'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false,
});

export default function RichTextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [savedHtml, setSavedHtml] = useState<string | null>(null);

  const handleSave = () => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    setSavedHtml(html);
  };

  const handleImageUpload = (file: File): Promise<{ data: { link: string } }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ data: { link: reader.result as string } });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-white rounded shadow">
      {/* Editor Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">Template Editor</h2>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbar={{
            options: [
              'inline', 'blockType', 'fontSize', 'fontFamily',
              'list', 'textAlign', 'colorPicker',
              'link', 'embedded', 'emoji', 'image', 'remove', 'history',
            ],
            inline: { inDropdown: false },
            list: { inDropdown: false },
            textAlign: { inDropdown: false },
            link: { inDropdown: false },
            history: { inDropdown: false },
            fontSize: {
              options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60],
            },
            fontFamily: {
              options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
            },
            image: {
              uploadEnabled: true,
              uploadCallback: handleImageUpload,
              previewImage: true,
              alt: { present: true, mandatory: false },
            },
          }}
          wrapperClassName="border rounded"
          editorClassName="min-h-[300px] p-2"
        />

        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Template
        </button>
      </div>

      {/* Preview Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">Read-Only Preview</h2>
        <div className="border p-4 bg-gray-50 min-h-[300px] overflow-auto whitespace-pre-wrap rounded">
          {savedHtml ? (
            <div dangerouslySetInnerHTML={{ __html: savedHtml }} />
          ) : (
            <p className="text-gray-400">No preview yet. Save your template to see the output.</p>
          )}
        </div>
      </div>
    </div>
  );
}
