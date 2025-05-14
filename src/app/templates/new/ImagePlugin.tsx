import { LexicalEditor } from 'lexical';
import { useEffect, useState } from 'react';

// Custom Image Plugin
const ImagePlugin = () => {
  const [imageUrl, setImageUrl] = useState('');

  const addImage = () => {
    const editor = LexicalEditor.create();
    editor.update(() => {
      const imageNode = new LexicalNode('image', imageUrl);
      editor.insertNode(imageNode);
    });
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter image URL" 
        value={imageUrl} 
        onChange={(e) => setImageUrl(e.target.value)} 
      />
      <button onClick={addImage}>Add Image</button>
    </div>
  );
};
export default ImagePlugin;  // Default export
