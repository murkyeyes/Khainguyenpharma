"use client";

import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeightClassName?: string;
  onUploadImage: (file: File) => Promise<string>;
  uploadButtonId: string;
}

interface EditorFormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
}

const initialFormatState: EditorFormatState = {
  bold: false,
  italic: false,
  underline: false,
  unorderedList: false,
  orderedList: false,
  alignLeft: true,
  alignCenter: false,
  alignRight: false,
};

const toolbarButtonClass =
  "h-9 min-w-9 px-2 rounded-md border border-transparent text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed";

const activeToolbarButtonClass = "!bg-blue-50 !border-blue-200 !text-blue-700";

function combineClasses(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(" ");
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  minHeightClassName = "min-h-[360px]",
  onUploadImage,
  uploadButtonId,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formatState, setFormatState] =
    useState<EditorFormatState>(initialFormatState);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  useEffect(() => {
    const syncToolbarState = () => {
      if (!editorRef.current) return;

      setFormatState({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        unorderedList: document.queryCommandState("insertUnorderedList"),
        orderedList: document.queryCommandState("insertOrderedList"),
        alignLeft: document.queryCommandState("justifyLeft"),
        alignCenter: document.queryCommandState("justifyCenter"),
        alignRight: document.queryCommandState("justifyRight"),
      });
    };

    document.addEventListener("selectionchange", syncToolbarState);
    return () =>
      document.removeEventListener("selectionchange", syncToolbarState);
  }, []);

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh vượt quá 5MB");
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await onUploadImage(file);
      exec("insertImage", imageUrl);
    } catch (error: any) {
      alert(error.message || "Upload ảnh thất bại");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleInsertLink = () => {
    const url = window.prompt("Nhập URL liên kết:");
    if (!url) return;

    if (!/^https?:\/\//i.test(url)) {
      alert("Vui lòng nhập URL bắt đầu bằng http:// hoặc https://");
      return;
    }

    exec("createLink", url);
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "paragraph") {
      exec("formatBlock", "<p>");
      return;
    }

    if (value === "h2") {
      exec("formatBlock", "<h2>");
      return;
    }

    if (value === "h3") {
      exec("formatBlock", "<h3>");
      return;
    }

    exec("formatBlock", "<p>");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
          <button
            type="button"
            onClick={() => exec("undo")}
            className={toolbarButtonClass}
            title="Hoàn tác"
            id={`${uploadButtonId}-undo`}
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => exec("redo")}
            className={toolbarButtonClass}
            title="Làm lại"
            id={`${uploadButtonId}-redo`}
          >
            ↷
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <select
            className="h-9 px-3 rounded-md border border-gray-200 text-sm text-gray-700 bg-white"
            onChange={handleFormatChange}
            defaultValue="paragraph"
            id={`${uploadButtonId}-format-select`}
          >
            <option value="paragraph">Văn bản thường</option>
            <option value="h2">Tiêu đề lớn (H2)</option>
            <option value="h3">Tiêu đề vừa (H3)</option>
          </select>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <button
            type="button"
            onClick={() => exec("bold")}
            className={combineClasses(
              toolbarButtonClass,
              formatState.bold && activeToolbarButtonClass,
            )}
            title="In đậm"
            id={`${uploadButtonId}-bold`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => exec("italic")}
            className={combineClasses(
              toolbarButtonClass,
              formatState.italic && activeToolbarButtonClass,
            )}
            title="In nghiêng"
            id={`${uploadButtonId}-italic`}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => exec("underline")}
            className={combineClasses(
              toolbarButtonClass,
              formatState.underline && activeToolbarButtonClass,
            )}
            title="Gạch chân"
            id={`${uploadButtonId}-underline`}
          >
            <span className="underline">U</span>
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <button
            type="button"
            onClick={() => exec("justifyLeft")}
            className={combineClasses(
              toolbarButtonClass,
              formatState.alignLeft && activeToolbarButtonClass,
            )}
            title="Căn trái"
            id={`${uploadButtonId}-align-left`}
          >
            ⬅
          </button>
          <button
            type="button"
            onClick={() => exec("justifyCenter")}
            className={combineClasses(
              toolbarButtonClass,
              formatState.alignCenter && activeToolbarButtonClass,
            )}
            title="Căn giữa"
            id={`${uploadButtonId}-align-center`}
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => exec("justifyRight")}
            className={combineClasses(
              toolbarButtonClass,
              formatState.alignRight && activeToolbarButtonClass,
            )}
            title="Căn phải"
            id={`${uploadButtonId}-align-right`}
          >
            ➡
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <button
            type="button"
            onClick={() => exec("insertUnorderedList")}
            className={combineClasses(
              toolbarButtonClass,
              formatState.unorderedList && activeToolbarButtonClass,
            )}
            title="Danh sách chấm"
            id={`${uploadButtonId}-list-unordered`}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => exec("insertOrderedList")}
            className={combineClasses(
              toolbarButtonClass,
              formatState.orderedList && activeToolbarButtonClass,
            )}
            title="Danh sách số"
            id={`${uploadButtonId}-list-ordered`}
          >
            1. List
          </button>

          <button
            type="button"
            onClick={handleInsertLink}
            className={toolbarButtonClass}
            title="Chèn liên kết"
            id={`${uploadButtonId}-insert-link`}
          >
            🔗 Link
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={combineClasses(
              toolbarButtonClass,
              "border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100",
            )}
            disabled={uploading}
            id={uploadButtonId}
          >
            {uploading ? "Đang upload..." : "🖼️ Chèn ảnh"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        <div className="bg-[#f1f3f4] px-4 py-6">
          <div className="mx-auto max-w-[820px] bg-white border border-gray-200 shadow-sm rounded-sm">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              className={combineClasses(
                "w-full px-12 py-10 focus:outline-none prose max-w-none leading-7 text-[15px] text-gray-800",
                minHeightClassName,
              )}
              data-placeholder={placeholder || "Nhập nội dung..."}
              id={`${uploadButtonId}-editor`}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Gợi ý: Enter để xuống dòng, Shift + Enter để xuống dòng ngắn, có thể
        chèn ảnh và link trực tiếp.
      </p>

      <style jsx>{`
        [contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }

        [contenteditable="true"] :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 12px 0;
        }

        [contenteditable="true"] :global(h2) {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 700;
          margin: 16px 0;
        }

        [contenteditable="true"] :global(h3) {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 700;
          margin: 12px 0;
        }

        [contenteditable="true"] :global(p) {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}
