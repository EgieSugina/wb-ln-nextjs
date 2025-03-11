'use client';

import { useEditor, EditorContent, BubbleMenu, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Write something...', className }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Handle initial content
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Prevent form submission when clicking editor buttons
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className={cn("border rounded-md p-2", className)}>
      <MenuBar editor={editor} onButtonClick={handleButtonClick} />
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex bg-white border rounded-md shadow-sm p-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBold().run();
              }}
              className={cn("p-1 rounded", editor.isActive('bold') ? 'bg-gray-200' : '')}
              type="button"
            >
              <span className="font-bold">B</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleItalic().run();
              }}
              className={cn("p-1 rounded", editor.isActive('italic') ? 'bg-gray-200' : '')}
              type="button"
            >
              <span className="italic">I</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleUnderline().run();
              }}
              className={cn("p-1 rounded", editor.isActive('underline') ? 'bg-gray-200' : '')}
              type="button"
            >
              <span className="underline">U</span>
            </button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

interface MenuBarProps {
  editor: Editor | null;
  onButtonClick: (e: React.MouseEvent) => void;
}

function MenuBar({ editor, onButtonClick }: MenuBarProps) {
  if (!editor) {
    return null;
  }

  const addImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap gap-1 mb-2 border-b pb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={cn(editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : '')}
        type="button"
      >
        H1
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={cn(editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : '')}
        type="button"
      >
        H2
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={cn(editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : '')}
        type="button"
      >
        H3
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().toggleBold().run();
        }}
        className={cn(editor.isActive('bold') ? 'bg-gray-200' : '')}
        type="button"
      >
        <span className="font-bold">B</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().toggleItalic().run();
        }}
        className={cn(editor.isActive('italic') ? 'bg-gray-200' : '')}
        type="button"
      >
        <span className="italic">I</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().toggleUnderline().run();
        }}
        className={cn(editor.isActive('underline') ? 'bg-gray-200' : '')}
        type="button"
      >
        <span className="underline">U</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().toggleBulletList().run();
        }}
        className={cn(editor.isActive('bulletList') ? 'bg-gray-200' : '')}
        type="button"
      >
        • List
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={cn(editor.isActive('orderedList') ? 'bg-gray-200' : '')}
        type="button"
      >
        1. List
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={cn(editor.isActive('blockquote') ? 'bg-gray-200' : '')}
        type="button"
      >
        Quote
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().setTextAlign('left').run();
        }}
        className={cn(editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : '')}
        type="button"
      >
        Left
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().setTextAlign('center').run();
        }}
        className={cn(editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : '')}
        type="button"
      >
        Center
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().setTextAlign('right').run();
        }}
        className={cn(editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : '')}
        type="button"
      >
        Right
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={setLink}
        className={cn(editor.isActive('link') ? 'bg-gray-200' : '')}
        type="button"
      >
        Link
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={addImage}
        type="button"
      >
        Image
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().undo().run();
        }}
        type="button"
      >
        Undo
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          onButtonClick(e);
          editor.chain().focus().redo().run();
        }}
        type="button"
      >
        Redo
      </Button>
    </div>
  );
} 