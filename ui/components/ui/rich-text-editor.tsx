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
        <div className="border-brand-divider bg-brand-background-dashboard/60 flex flex-wrap gap-1 border-b border-solid p-2">
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
                    // `@tailwindcss/typography` isn't installed, so the editor
                    // needs its own explicit, on-brand type scale.
                    "text-brand-text/85 min-h-[140px] max-w-none p-4 text-[15px] leading-relaxed focus:outline-none",
                    "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
                    "[&_p]:my-2",
                    "[&_h1]:text-brand-text [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold",
                    "[&_h2]:text-brand-text [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold",
                    "[&_h3]:text-brand-text [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold",
                    "[&_strong]:text-brand-text [&_strong]:font-semibold",
                    "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
                    "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
                    "[&_li::marker]:text-brand-text/35",
                    "[&_blockquote]:border-brand-red/40 [&_blockquote]:text-brand-text/60 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-solid [&_blockquote]:pl-4 [&_blockquote]:italic",
                    "[&_code]:bg-brand-text/[0.06] [&_code]:text-brand-text [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
                    "[&_pre]:bg-brand-deep-black [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:text-white",
                    "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
                    "[&_.is-editor-empty:first-child::before]:text-brand-text/35",
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
                "border-brand-divider overflow-hidden rounded-xl border border-solid bg-white transition-colors duration-200",
                "focus-within:border-brand-text/30",
                className
            )}
        >
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}

export default RichTextEditor;