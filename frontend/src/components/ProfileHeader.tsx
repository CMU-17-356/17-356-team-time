import axios from "axios";
import {
  Check,
  Github,
  Globe,
  Linkedin,
  MoreVertical,
  Pencil,
  Trash2,
  Twitter,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  PROFILE_API_ENDPOINT,
  PROFILE_IMAGE_NAME,
  PROFILE_IMG_ENDPOINT,
} from "../consts";
import { Profile, ProfileHeaderProps } from "../types";
import { ProfileInterests } from "./ProfileInterests";
import ProfileImageUploader from "./ProfileUpload";

export const ProfileHeader = (props: ProfileHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  // const [profileHover, setProfileHover] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFollowing, setisFollowing] = useState(props.isFollowing);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState(props.bio);
  const [tempInterests, setTempInterests] = useState(
    props.fieldOfInterest || "",
  );

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the menu to close it
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Form data
  const [editFormData, setEditFormData] = useState({
    firstName: props.firstName,
    lastName: props.lastName,
    affiliation: props.institution,
  });

  // dealing with uploading/deleting images from S3
  const handleUploadImage = async () => {
    if (!imageBlob) {
      return;
    }

    try {
      setUploadProgress(0);

      // Create a new file from the blob with a consistent filename
      const pngFile = new File([imageBlob], PROFILE_IMAGE_NAME, {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("image", pngFile);

      // Check if we should update or create
      if (currentImage) {
        // Update existing image
        await axios.put(`${PROFILE_IMG_ENDPOINT}/${props.userId}`, formData, {
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
        await axios.post(`${PROFILE_IMG_ENDPOINT}/${props.userId}`, formData, {
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

      setImageBlob(null);
      setUploadProgress(0);
      await fetchCurrentImage();
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const handleDeleteImage = async () => {
    try {
      if (
        !window.confirm("Are you sure you want to delete your profile image?")
      ) {
        return;
      }

      await axios.delete(`${PROFILE_IMG_ENDPOINT}/${props.userId}`);
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  useEffect(() => {
    fetchCurrentImage();
  }, [props.userId]);

  const fetchCurrentImage = async () => {
    try {
      const response = await axios.get(
        `${PROFILE_IMG_ENDPOINT}/${props.userId}`,
      );
      const imageUrl = response.data;

      if (imageUrl) {
        setCurrentImage(imageUrl.url);
      } else {
        setCurrentImage(null);
      }
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  // Handle bio change
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempBio(e.target.value);
  };

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Save changes
  const handleSaveChanges = () => {
    const researcherExpr: Partial<Profile> = {
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      institution: editFormData.affiliation,
      bio: tempBio,
      fieldOfInterest: tempInterests,
    };
    axios
      .put(`${PROFILE_API_ENDPOINT}/${props.userId}`, researcherExpr)
      .then((response) => {
        props.setResearcher({ ...researcherExpr, ...response.data });
        setIsEditing(false);
        window.location.reload();
      })
      .catch((error: any) => {
        console.log(error);
      });

    if (currentImage === null) {
      handleDeleteImage();
    } else if (imageBlob) {
      handleUploadImage();
    }
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancelEdit = async () => {
    setEditFormData({
      firstName: props.firstName,
      lastName: props.lastName,
      affiliation: props.institution,
    });
    setTempInterests(props.fieldOfInterest || "");
    await fetchCurrentImage();
    setIsEditing(false);
  };

  // Delete profile
  const handleDeleteProfile = () => {
    // TODO: make an API call to delete the profile
    axios
      .delete(`${PROFILE_API_ENDPOINT}/${props.userId}`)
      .then(() => {
        alert("Profile deleted successfully!");
        window.open("/");
      })
      .catch((error: any) => {
        console.log(error);
      });
    setShowDeleteConfirm(false);
  };

  // Toggle follow state
  const toggleFollow = () => {
    // TODO: push follow changes to server
    setisFollowing(!isFollowing);
    props.setResearcher({
      ...props,
      followers: isFollowing ? props.followers - 1 : props.followers + 1,
    });
  };

  // Handle profile picture upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: upload the file to a server here
      // hack: placeholder and simulate a successful upload
      props.setResearcher({
        ...props,
        profilePicture: "/api/placeholder/200/200",
      });
      setShowImageUpload(false);
    }
  };

  // Trigger file input click
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // Update tempBio and tempInterests when researcher data changes or edit mode is entered
  React.useEffect(() => {
    setTempBio(props.bio);
  }, [props.bio, isEditing]);

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center">
          {/* Profile Picture */}
          <ProfileImageUploader
            isEditing={isEditing}
            currentImage={currentImage}
            setCurrentImage={setCurrentImage}
            setBlob={setImageBlob}
            uploadProgress={uploadProgress}
          />

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={editFormData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={editFormData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="affiliation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Affiliation
                  </label>
                  <input
                    type="text"
                    id="affiliation"
                    name="affiliation"
                    value={editFormData.affiliation}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{`${props.firstName} ${props.lastName}`}</h2>
                    <p className="text-gray-600">{props.institution}</p>

                    {/* Follow Stats */}
                    <div className="mt-2 flex space-x-4 text-sm">
                      <span>
                        <strong data-testid="following-count-id">
                          {props.following}
                        </strong>{" "}
                        Following
                      </span>
                      <span>
                        <strong data-testid="follower-count-id">
                          {props.followers}
                        </strong>{" "}
                        Followers
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 items-end">
                    {/* Menu Button - Only show when viewing own profile */}
                    {props.isOwnProfile && (
                      <div className="relative" ref={menuRef}>
                        <button
                          onClick={() => setShowMenu(!showMenu)}
                          className="p-2 rounded-full hover:bg-gray-200"
                          data-testid="hamburger-menu-button"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                            <button
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => {
                                setIsEditing(true);
                                setShowMenu(false);
                              }}
                            >
                              <Pencil size={16} className="mr-2" />
                              Edit Profile
                            </button>
                            <button
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              onClick={() => {
                                setShowDeleteConfirm(true);
                                setShowMenu(false);
                              }}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete Profile
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Follow Button */}
                    <button
                      onClick={toggleFollow}
                      className={`flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium ${
                        isFollowing
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <Check size={16} className="mr-1" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} className="mr-1" />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-4 flex space-x-4 justify-center md:justify-start">
                  {props.socials.twitter && (
                    <a
                      href={props.socials.twitter}
                      className="text-gray-600 hover:text-blue-500"
                      data-testid="twitter-link"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                  {props.socials.github && (
                    <a
                      href={props.socials.github}
                      className="text-gray-600 hover:text-gray-900"
                      data-testid="github-link"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {props.socials.linkedin && (
                    <a
                      href={props.socials.linkedin}
                      className="text-gray-600 hover:text-blue-700"
                      data-testid="linkedin-link"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {props.socials.website && (
                    <a
                      href={props.socials.website}
                      className="text-gray-600 hover:text-green-600"
                      data-testid="website-link"
                    >
                      <Globe size={20} />
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <ProfileInterests
          {...{
            fieldOfInterest: tempInterests,
            isEditing,
            onSubmit: setTempInterests,
          }}
        />

        {/* Bio Section */}
        <div className="border-t-2 border-slate-200 pt-2">
          {isEditing ? (
            <div>
              <textarea
                value={tempBio}
                onChange={handleBioChange}
                placeholder="Enter your biography..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-2">
                Describe your research interests, experience, and background.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mt-2 italic">{props.bio}</p>
              {props.bio === "" && (
                <p className="text-gray-500 italic">No biography available.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Delete Confirmation popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Delete Profile
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">
                Are you sure you want to delete your profile? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload popup */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Update Profile Picture
              </h3>
              <button
                onClick={() => setShowImageUpload(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-6 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                <img
                  src={props.profilePicture}
                  alt="Current profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={openFileSelector}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Upload size={16} className="mr-2" />
                Upload New Picture
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowImageUpload(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
