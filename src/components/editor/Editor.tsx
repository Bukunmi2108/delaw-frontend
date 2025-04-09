import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { marked } from 'marked';
import './menu-bar.css'; // Import the CSS file

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}
export default function Editor({
  content,
  onChange,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc editor-list-margin-left",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal editor-list-margin-left",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: marked.parse(content),
    editorProps: {
      attributes: {
        class: "editor-content",
      },
    },
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />;
    </div>
  );
}