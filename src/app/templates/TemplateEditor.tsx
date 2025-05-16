'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from 'tiptap-extension-font-size';
import LineHeight from 'tiptap-extension-line-height';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaImage, FaTable, FaHighlighter, FaLink, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify } from 'react-icons/fa';
import { SketchPicker } from 'react-color';
import { useEffect, useState } from 'react';

export default function TemplateEditor({ content, onChange }: { content: string; onChange: (value: string) => void }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('#000000');
  const [isPreview, setIsPreview] = useState(false); // state to toggle preview mode

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      TextStyle,
      Highlight,
      Link,
      FontFamily,
      FontSize,
      LineHeight
    ],
    content,
    // onUpdate: ({ editor }) => {
    //   onChange(editor.getHTML());
    //   saveToDatabase(editor.getHTML());
    // },
  });

  // const saveToDatabase = async (html: string) => {
  //   try {
  //     await fetch('/api/save-template', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ content: html }),
  //     });
  //   } catch (error) {
  //     console.error('Save failed', error);
  //   }
  // };

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const insertPlaceholder = (tag: string) => {
    editor.chain().focus().insertContent(`{{${tag}}}`).run();
  };

  const insertImageFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file); // Convert the image file to a base64 string
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const applyHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  const applyLink = () => {
    const url = prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const toggleAlignment = (alignment: string) => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn"><FaBold /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn"><FaItalic /></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn"><FaUnderline /></button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn"><FaListUl /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn"><FaListOl /></button>
        <button onClick={() => editor.chain().focus().setParagraph().run()} className="btn">P</button>
        <button onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()} className="btn">H2</button>
        <button onClick={insertImage} className="btn"><FaImage /></button>
        <input type="file" onChange={insertImageFromFile} className="btn" />
        <button onClick={insertTable} className="btn"><FaTable /></button>
        <button onClick={() => toggleAlignment('left')} className="btn"><FaAlignLeft /></button>
        <button onClick={() => toggleAlignment('center')} className="btn"><FaAlignCenter /></button>
        <button onClick={() => toggleAlignment('right')} className="btn"><FaAlignRight /></button>
        <button onClick={() => toggleAlignment('justify')} className="btn"><FaAlignJustify /></button>
        <button onClick={applyLink} className="btn"><FaLink /></button>
        <button onClick={() => setShowColorPicker(!showColorPicker)} className="btn">Text Color</button>
        <button onClick={() => applyHighlight('yellow')} className="btn"><FaHighlighter /></button>
        <select onChange={(e) => insertPlaceholder(e.target.value)} className="border px-2">
          <option value="">Insert Variable</option>
          <option value="header">Header</option>
          <option value="logo">Logo</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="sender_name">Sender Name</option>
          <option value="recipient_name">Recipient Name</option>
          <option value="title">Title</option>
          <option value="body">Body</option>
          <option value="stamp">stamp</option>
          <option value="signature">Signature</option>
          <option value="titor">Titor</option>
          <option value="footer">Footer</option>
        </select>
        <select onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()} className="border px-2">
          <option value="">Font</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <select onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()} className="border px-2">
          <option value="">Font Size</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="18px">18px</option>
          <option value="24px">24px</option>
        </select>
        <select onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()} className="border px-2">
          <option value="">Line Height</option>
          <option value="1">1</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
          <option value="2.5">2.5</option>
        </select>
        {showColorPicker && (
          <div className="absolute z-50">
            <SketchPicker
              color={color}
              onChangeComplete={(col) => {
                setColor(col.hex);
                applyColor(col.hex);
              }}
            />
          </div>
        )}
        <button onClick={() => setIsPreview(!isPreview)} className="btn">{isPreview ? 'Edit' : 'Preview'}</button>
      </div>

      {/* Preview or Editor */}
      {isPreview ? (
        <div 
          className="border p-4 bg-white rounded shadow min-h-[300px] prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      ) : (
        <EditorContent editor={editor} className="border p-4 bg-white rounded shadow min-h-[300px] prose max-w-none" />
      )}
    </div>
  );
}
