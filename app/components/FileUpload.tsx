'use client';

import { useState, useEffect } from 'react';
import type { FileUploadProps } from '@/app/types';
import supabase from '@/app/lib/supabase/client';

export default function FileUpload({
  name,
  id,
  label,
  description,
}: FileUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // get the file from the input
    if (!file) {
      return;
    }
    const { data, error } = await supabase.storage
      .from('model-images')
      .upload(file.name, file);

    if (error) {
      console.error('Error uploading file:', error);
      return;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('model-images')
      .getPublicUrl(data.path);

    setImageUrl(urlData.publicUrl);

    // set the image preview if the component is mounted
    if (isClient) {
      // only set the image preview if the component is mounted
      setImagePreview(URL.createObjectURL(file));
      //Creates a temporary blob URL, Points to the file in browser memory, Only works locally, Temporary
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-800 mb-2"
      >
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-500 mt-2 mb-4">{description}</p>
      )}

      {/* Custom File Upload Button */}
      <div className="relative">
        <input
          type="file"
          id={id}
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
        <label
          htmlFor={id}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg cursor-pointer"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Upload
        </label>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            className="max-w-xs rounded-lg shadow-md border border-gray-200"
            alt="Model preview"
          />
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={imageUrl} />
    </div>
  );
}
