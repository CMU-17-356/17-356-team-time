import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ResearcherProfile } from "../components/ResearcherProfile";
import { PROFILE_API_ENDPOINT, emptyResearcher } from "../consts";
import { Researcher } from "../types";
import { useAuth } from "../context/AuthContext";

export const ProfilePage = () => {
  const [researcher, setResearcher] = useState<Researcher | null>();
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();

  // Check if the current logged-in user is viewing their own profile
  const isOwnProfile = user?.username === userId;

  useEffect(() => {
    console.log("trying to fetch researcher with id: ", userId);
    axios
      .get(`${PROFILE_API_ENDPOINT}/${userId}`)
      .then((response) => {
        setResearcher({ ...emptyResearcher, ...response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);

  return researcher ? (
    <ResearcherProfile {...researcher} isOwnProfile={isOwnProfile} />
  ) : (
    <div>Loading...</div>
  );
};
