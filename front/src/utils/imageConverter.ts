// imageConverter.ts
import { useState, useCallback } from "react";

// Custom hook for image conversion between File and Base64
export const useImageConverter = () => {
  const [base64, setBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Convert File to Base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  // Handle <input type="file" /> change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setError("No file selected");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Invalid file type. Please upload an image.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await convertImageToBase64(file);
      setBase64(result);
      setError(null);
    } catch {
      setError("Failed to convert image.");
      setBase64(null);
    } finally {
      setLoading(false);
    }
  };

  // Convert Base64 to File
  const convertBase64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  };

  // Reset state
  const reset = useCallback(() => {
    setBase64(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    base64,
    error,
    loading,
    handleFileChange,
    convertBase64ToFile,
    reset,
  };
};