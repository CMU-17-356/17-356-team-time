import axios from "axios";
import React, { useEffect, useState } from "react";
import { PROFILE_IMG_ENDPOINT } from "../consts";

interface ProfileImageProps {
  userId: string;
  width: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ userId, width }) => {
  const [currentImage, setCurrentImage] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    fetchCurrentImage();
  }, [userId]);

  const fetchCurrentImage = async () => {
    const checkImage = async (url: string) => {
      const res = await fetch(url);
      const buff = await res.blob();

      return buff.type.startsWith("image/");
    };

    try {
      const response = await axios.get(`${PROFILE_IMG_ENDPOINT}/${userId}`);
      const imageUrl = response.data;

      const valid = await checkImage(imageUrl.url);
      if (valid) {
        setCurrentImage(imageUrl.url);
      } else {
        setCurrentImage(undefined);
      }
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  return (
    <div className="mr-2">
      {currentImage !== undefined ? (
        <div className="relative">
          <div
            className={`w-${width} h-${width} rounded-full overflow-hidden relative`}
            data-testid="profile-picture-id"
          >
            <img
              src={currentImage}
              alt="Profile"
              className={`w-${width} h-${width} object-cover mx-auto`}
            />
          </div>
        </div>
      ) : (
        <div className={`w-${width} h-${width} rounded-full mx-auto relative`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-auto"
          >
            <circle cx="24" cy="24" r="24" fill="#f3f4f6" />
            <g
              transform="translate(12, 12)"
              fill="none"
              stroke="#9ca3af"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
