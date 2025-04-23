// frontend/src/components/SingleImageUploader.tsx
import axios from "axios";
import { Camera } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { PROFILE_IMG_ENDPOINT } from "../consts";
import ImageCropper from "./ImageCropper";

interface SingleImageUploaderProps {
  userId: string;
  isEditing: boolean;
}

const ProfileImageUploader: React.FC<SingleImageUploaderProps> = ({
  userId,
  isEditing,
}) => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileHover, setProfileHover] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCropper, setShowCropper] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const PROFILE_IMAGE_NAME = "profile.png";

  // Trigger file input click
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    fetchCurrentImage();
  }, [userId]);

  const fetchCurrentImage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${PROFILE_IMG_ENDPOINT}/${userId}`);
      const imageUrl = response.data;

      if (imageUrl) {
        setCurrentImage(imageUrl.url);
      } else {
        setCurrentImage(null);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching image:", err);
    } finally {
      setLoading(false);
    }
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
      setShowCropper(true);
      setError(null);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!croppedBlob) {
      setError("Failed to crop image");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      setShowCropper(false);

      // Create a new file from the blob with a consistent filename
      const pngFile = new File([croppedBlob], PROFILE_IMAGE_NAME, {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("image", pngFile);

      // Check if we should update or create
      if (currentImage) {
        // Update existing image
        await axios.put(`${PROFILE_IMG_ENDPOINT}/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        });
      } else {
        // Upload new image
        await axios.post(`${PROFILE_IMG_ENDPOINT}/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        });
      }

      setSelectedFile(null);
      setUploadProgress(0);
      await fetchCurrentImage();
    } catch (err) {
      setError("Failed to upload image");
      console.error("Error uploading image:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (
        !window.confirm("Are you sure you want to delete your profile image?")
      ) {
        return;
      }

      setLoading(true);
      await axios.delete(`${PROFILE_IMG_ENDPOINT}/${userId}`);
      setCurrentImage(null);
    } catch (err) {
      setError("Failed to delete image");
      console.error("Error deleting image:", err);
    } finally {
      setLoading(false);
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
                className="w-48 h-48 object-cover mx-auto rounded-full border-4 border-white shadow-lg"
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
              <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                Replace
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
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

      {loading && !uploadProgress && (
        <div className="mt-4 text-center text-gray-600">Loading...</div>
      )}

      {showCropper && selectedFile && (
        <ImageCropper
          file={selectedFile}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
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
