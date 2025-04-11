import React, { useRef, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Editor as Tiptap } from '@tiptap/core'; // Import the Editor type
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { marked } from "marked";
import "./menu-bar.css";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  editorRef: React.MutableRefObject<Tiptap | null> | undefined; // Receive the ref
}

export default function Editor({ content, onChange, editorRef }: EditorProps) {
  const editorInstance = useEditor({
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
        class: "tiptap ProseMirror editor-content",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef) {
      editorRef.current = editorInstance;
    }
  }, [editorInstance, editorRef]);

  useEffect(() => {
    const handleScroll = () => {
      if (editorContainerRef.current && menuBarRef.current) {
        const containerScrollTop = editorContainerRef.current.scrollTop;
        const menuBarOffsetTop = menuBarRef.current.offsetTop - editorContainerRef.current.offsetTop; // Relative to container

        if (containerScrollTop > menuBarOffsetTop) {
          menuBarRef.current.classList.add("fixed-within-container");
        } else {
          menuBarRef.current.classList.remove("fixed-within-container");
        }
      }
    };

    if (editorContainerRef.current) {
      editorContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (editorContainerRef.current) {
        editorContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="rich-text-editor-container" ref={editorContainerRef}>
      <div ref={menuBarRef} className="menu-bar">
        <MenuBar editor={editorInstance} /> {/* Use editorInstance here */}
      </div>
      <div className="editor-wrapper">
        <EditorContent editor={editorInstance} /> {/* Use editorInstance here */}
      </div>
    </div>
  );
}