import React, { useEffect, useState } from "react";
import SearchPage, { Profile } from "./SearchPage";

const SearchHelper: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/profiles");
        const data = await res.json();
        setProfiles(data);
      } catch (err) {
        console.error("Failed to load profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading)
    return <div className="text-center p-6">Loading profiles...</div>;

  return <SearchPage profiles={profiles} />;
};

export default SearchHelper;
