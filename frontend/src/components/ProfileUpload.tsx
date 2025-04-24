// frontend/src/components/SingleImageUploader.tsx
import { Camera } from "lucide-react";
import React, { useRef, useState } from "react";
import ImageCropper from "./ImageCropper";

interface SingleImageUploaderProps {
  isEditing: boolean;
  currentImage: string | null;
  uploadProgress: number;
  setCurrentImage: (image: string | null) => void;
  setBlob: (blob: Blob) => void;
}

const ProfileImageUploader: React.FC<SingleImageUploaderProps> = ({
  isEditing,
  currentImage,
  uploadProgress,
  setCurrentImage,
  setBlob,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [profileHover, setProfileHover] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [showCropper, setShowCropper] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input click
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      // setShowCropper(true);
      setError(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="text-center">
        {currentImage ? (
          <div className="relative">
            <div
              className="w-48 h-48 rounded-full overflow-hidden relative"
              onMouseEnter={() => isEditing && setProfileHover(true)}
              onMouseLeave={() => setProfileHover(false)}
              onClick={() => isEditing && openFileSelector()}
              data-testid="profile-picture-id"
            >
              <img
                src={currentImage}
                alt="Profile"
                className="w-full h-full object-cover mx-auto border-4 border-white shadow-lg"
              />
              {isEditing && profileHover && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                  <Camera size={24} color="white" />
                </div>
              )}
            </div>
            <div
              className={
                isEditing ? "mt-4 flex justify-center gap-4" : "hidden"
              }
            >
              <button
                onClick={() => setCurrentImage(null)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Image
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-48 h-48 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <label className="block">
              <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer inline-block">
                Upload Image
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {selectedFile && (
        <ImageCropper
          file={selectedFile}
          onCropComplete={(imageBlob: Blob) => {
            // setShowCropper(false);
            setBlob(imageBlob);
            setSelectedFile(null);
          }}
          onCancel={() => {
            // setShowCropper(false);
            setSelectedFile(null);
          }}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default ProfileImageUploader;
