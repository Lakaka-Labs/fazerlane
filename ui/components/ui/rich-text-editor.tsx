// components/ui/rich-text-editor.tsx
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "tiptap-markdown";
import { common, createLowlight } from "lowlight";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Code2,
} from "lucide-react";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    editorClassName?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt("Enter URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-1 border-b border-border p-2">
            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                aria-label="Bold"
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                aria-label="Italic"
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                aria-label="Underline"
            >
                <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                aria-label="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            <div className="mx-1 h-6 w-px bg-border" />

            <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
                aria-label="Inline Code"
            >
                <Code className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("codeBlock")}
                onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                aria-label="Code Block"
            >
                <Code2 className="h-4 w-4" />
            </Toggle>

            <div className="mx-1 h-6 w-px bg-border" />

            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                aria-label="Bullet List"
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                aria-label="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                aria-label="Blockquote"
            >
                <Quote className="h-4 w-4" />
            </Toggle>

            <div className="mx-1 h-6 w-px bg-border" />

            <Toggle
                size="sm"
                pressed={editor.isActive("link")}
                onPressedChange={addLink}
                aria-label="Add Link"
            >
                <LinkIcon className="h-4 w-4" />
            </Toggle>

            <div className="mx-1 h-6 w-px bg-border" />

            <Toggle
                size="sm"
                pressed={false}
                onPressedChange={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                aria-label="Undo"
            >
                <Undo className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={false}
                onPressedChange={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                aria-label="Redo"
            >
                <Redo className="h-4 w-4" />
            </Toggle>
        </div>
    );
};

export function RichTextEditor({
                                   value,
                                   onChange,
                                   placeholder = "Start typing...",
                                   className,
                                   editorClassName,
                               }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false, // Fix for SSR hydration mismatch
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: "is-editor-empty",
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline cursor-pointer",
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: "bg-muted rounded-md p-4 font-mono text-sm",
                },
            }),
            Markdown.configure({
                html: false,
                transformCopiedText: true,
                transformPastedText: true,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm dark:prose-invert max-w-none min-h-[100px] p-3 focus:outline-none",
                    "[&_.is-editor-empty:first-child::before]:text-muted-foreground",
                    "[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
                    "[&_.is-editor-empty:first-child::before]:float-left",
                    "[&_.is-editor-empty:first-child::before]:pointer-events-none",
                    "[&_.is-editor-empty:first-child::before]:h-0",
                    editorClassName
                ),
            },
        },
        onUpdate: ({ editor }) => {
            const markdown = (editor.storage as any).markdown.getMarkdown();
            onChange(markdown);
        },
    });

    useEffect(() => {
        if (editor) {
            const currentMarkdown = (editor.storage as any).markdown.getMarkdown();
            if (value !== currentMarkdown) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    return (
        <div
            className={cn(
                "rounded-xl border border-border bg-background overflow-hidden",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                className
            )}
        >
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}

export default RichTextEditor;