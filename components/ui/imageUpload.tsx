"use client";

import React, { useRef, useState } from "react";

interface ImageUploadProps {
  value?: string | null; // URL of the already uploaded image
  onChange: (file: File | null) => void; // Callback for handling new uploads
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null); // Preview state for new image or URL

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setPreview(URL.createObjectURL(file)); // Generate preview for the new file
    }
    onChange(file); // Trigger the onChange callback with the new file
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`flex items-center justify-center w-full h-48 border rounded bg-transparent duration-200 cursor-pointer hover:bg-primary ${
        preview ? "p-2" : ""
      }`}
      onClick={handleUploadClick}
    >
      {preview ? (
        <img
          src={preview}
          alt="Uploaded"
          className="w-full h-full object-contain rounded"
        />
      ) : (
        <span className="text-gray-500">Upload Now</span>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
    