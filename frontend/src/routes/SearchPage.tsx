import React, { useState } from "react";
import { Link } from "react-router-dom";

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface Profile extends User {
  profileId: string;
  createdAt: string;
  updatedAt?: string;
  phone?: string;
  institution?: string;
  fieldOfInterest?: string;
  bio?: string;
}

type Props = {
  profiles: Profile[];
};

const SearchPage: React.FC<Props> = ({ profiles }) => {
  const [query, setQuery] = useState("");

  const filteredProfiles = profiles.filter((profile) => {
    const searchableText = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.phone,
      profile.institution,
      profile.fieldOfInterest,
      profile.bio,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query.toLowerCase());
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <input
        type="text"
        placeholder="Search profiles by name, institution, interests..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm mb-6 focus:outline-none focus:ring focus:border-blue-300"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProfiles.map((profile) => (
          <Link
            to={`/profile/${profile.userId}`}
            key={profile.profileId}
            className="block p-4 bg-white border rounded-2xl shadow-md hover:shadow-lg hover:border-blue-400 transition"
          >
            <h2 className="text-xl font-semibold">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600">{profile.email}</p>
            {profile.institution && (
              <p className="text-gray-500 text-sm">
                Institution: {profile.institution}
              </p>
            )}
            {profile.fieldOfInterest && (
              <p className="text-gray-500 text-sm">
                Interest: {profile.fieldOfInterest}
              </p>
            )}
            {profile.bio && (
              <p className="text-gray-700 mt-2 truncate">{profile.bio}</p>
            )}
          </Link>
        ))}

        {filteredProfiles.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No matching profiles found.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
