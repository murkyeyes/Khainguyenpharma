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

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  minHeightClassName = "min-h-[280px]",
  onUploadImage,
  uploadButtonId,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => exec("bold")}
            className="px-3 py-1.5 text-sm border rounded hover:bg-white"
            title="In đậm"
            id={`${uploadButtonId}-bold`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => exec("italic")}
            className="px-3 py-1.5 text-sm border rounded hover:bg-white"
            title="In nghiêng"
            id={`${uploadButtonId}-italic`}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => exec("insertUnorderedList")}
            className="px-3 py-1.5 text-sm border rounded hover:bg-white"
            title="Danh sách"
            id={`${uploadButtonId}-list`}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<h3>")}
            className="px-3 py-1.5 text-sm border rounded hover:bg-white"
            title="Tiêu đề"
            id={`${uploadButtonId}-h3`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<p>")}
            className="px-3 py-1.5 text-sm border rounded hover:bg-white"
            title="Đoạn văn"
            id={`${uploadButtonId}-p`}
          >
            P
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm border rounded hover:bg-white text-blue-700 border-blue-200 bg-blue-50"
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

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className={`w-full px-4 py-3 focus:outline-none ${minHeightClassName} prose max-w-none`}
          data-placeholder={placeholder || "Nhập nội dung..."}
          id={`${uploadButtonId}-editor`}
        />
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Nhấn Enter để xuống dòng. Có thể chèn ảnh trực tiếp vào nội dung.
      </p>

      <style jsx>{`
        [contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
}
