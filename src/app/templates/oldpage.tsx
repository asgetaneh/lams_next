'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useRouter } from 'next/navigation';
import { saveTemplate, getTemplate, updateTemplate } from '@/lib/templateService';

// Dynamic import for better performance
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

interface TemplateFormProps {
  templateId?: string;
  isEditMode?: boolean;
}

export default function TemplateForm({ templateId, isEditMode = false }: TemplateFormProps) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [savedHtml, setSavedHtml] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Load template if in edit mode
  useEffect(() => {
    if (isEditMode && templateId) {
      const loadTemplate = async () => {
        try {
          setIsLoading(true);
          const template = await getTemplate(templateId);
          if (template) {
            setTitle(template.title);
            setSavedHtml(template.content);
            
            // Convert HTML to editor state
            const blocksFromHtml = htmlToDraft(template.content);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            setEditorState(EditorState.createWithContent(contentState));
          }
        } catch (err) {
          setError('Failed to load template');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadTemplate();
    }
  }, [isEditMode, templateId]);

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      const rawContent = convertToRaw(editorState.getCurrentContent());
      const html = draftToHtml(rawContent);
      setSavedHtml(html);

      // Save to database
      const templateData = {
        title: title || 'Untitled Template',
        content: html,
        updatedAt: new Date().toISOString()
      };

      if (isEditMode && templateId) {
        await updateTemplate(templateId, templateData);
        setSuccess('Template updated successfully!');
      } else {
        const newTemplate = await saveTemplate(templateData);
        setSuccess('Template saved successfully!');
        // Redirect to edit page after creation
        setTimeout(() => router.push(`/templates/${newTemplate.id}`), 1500);
      }
    } catch (err) {
      setError('Failed to save template');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [editorState, title, isEditMode, templateId, router]);

  const handleImageUpload = (file: File): Promise<{ data: { link: string } }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ data: { link: reader.result as string } });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleExport = () => {
    if (!savedHtml) return;
    
    const blob = new Blob([savedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'template'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setEditorState(EditorState.createEmpty());
    setSavedHtml('');
    setTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Template' : 'Create New Template'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Template Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter template title"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Editor</h2>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbar={{
              options: [
                'inline', 'blockType', 'fontSize', 'fontFamily',
                'list', 'textAlign', 'colorPicker', 'emoji',
                'link', 'embedded', 'image', 'remove', 'history',
              ],
              inline: { 
                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
                inDropdown: false 
              },
              blockType: {
                inDropdown: true,
                options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote', 'Code'],
              },
              list: { 
                inDropdown: false,
                options: ['unordered', 'ordered', 'indent', 'outdent']
              },
              textAlign: { 
                inDropdown: false,
                options: ['left', 'center', 'right', 'justify']
              },
              link: { 
                inDropdown: false,
                showOpenOptionOnHover: true
              },
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
                defaultSize: { height: 'auto', width: '100%' },
              },
            }}
            wrapperClassName="border rounded"
            editorClassName="min-h-[400px] p-4 bg-white"
            toolbarClassName="border-b"
          />
        </div>

        {/* Preview Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Preview</h2>
            <button
              onClick={handleExport}
              disabled={!savedHtml}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Export HTML
            </button>
          </div>
          <div className="border p-4 bg-gray-50 min-h-[400px] overflow-auto rounded">
            {savedHtml ? (
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: savedHtml }} 
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No preview available. Save your template to see the output.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditMode ? 'Updating...' : 'Saving...'}
            </span>
          ) : (
            <span>{isEditMode ? 'Update Template' : 'Save Template'}</span>
          )}
        </button>
      </div>
    </div>
  );
}