import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { PROFILE_API_ENDPOINT } from "../consts";

interface Profile {
  userId: string;
  firstName: string;
  lastName: string;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tagInput: "",
  });
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${PROFILE_API_ENDPOINT}`);
        setProfiles(response.data.profiles || []);

        // Set the first profile as default if available
        if (response.data.profiles && response.data.profiles.length > 0) {
          setSelectedUserId(response.data.profiles[0].userId);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError("Failed to load user profiles");
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (e.target.name === "userId") {
      setSelectedUserId(e.target.value);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle tag input
  const handleAddTag = () => {
    if (formData.tagInput.trim() && !tags.includes(formData.tagInput.trim())) {
      setTags([...tags, formData.tagInput.trim()]);
      setFormData({ ...formData, tagInput: "" });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle key press in tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileUpload = () => {
    alert("File upload functionality!");
  };

  const handleImageUpload = () => {
    alert("Image upload functionality!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    if (!selectedUserId) {
      setError("Please select an author");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5001/api/posts", {
        title: formData.title,
        content: formData.content,
        tags: tags,
        userId: selectedUserId,
        likeCount: 0, // Initialize with 0 likes
      });

      alert("Post created successfully!");
      console.log("Post Created:", response.data);

      // Redirect to the profile page
      navigate(`/profile/${selectedUserId}`, { replace: true });
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading profiles...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fce6d2]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          {/* Author Selection Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="userId"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Select Author
            </label>
            <select
              id="userId"
              name="userId"
              value={selectedUserId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="" disabled>
                Select an author
              </option>
              {profiles.map((profile) => (
                <option key={profile.userId} value={profile.userId}>
                  {profile.firstName} {profile.lastName}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            name="title"
            placeholder="Post Title"
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
            required
          />

          <textarea
            name="content"
            placeholder="Write your post content here..."
            className="w-full p-2 border rounded mb-4 h-64"
            onChange={handleChange}
            required
          />

          {/* File and Image Upload UI */}
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={handleFileUpload}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              Attach File
            </button>

            <button
              type="button"
              onClick={handleImageUpload}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Add Image
            </button>
          </div>

          <div className="mb-4">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="tagInput"
                value={formData.tagInput}
                onChange={handleChange}
                onKeyPress={handleTagKeyPress}
                className="flex-grow p-2 border rounded-l"
                placeholder="Add tags (e.g., machine learning)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-[#faab99] text-white rounded-r hover:bg-[#f89686]"
              >
                Add Tag
              </button>
            </div>

            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#faab99] text-white py-2 rounded hover:bg-[#f89686]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
