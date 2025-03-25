import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { ResearcherProfile } from "./ResearcherProfile";
import { emptyResearcher } from "./consts";
import { Researcher } from "./types";

export const ProfilePage = (props: {profiles: Researcher[]}) => {

  const [researcher, setResearcher] = useState<Researcher>(emptyResearcher);
  // const [id, setProfileId] = useState<string>(useParams().profileId);
  const [activeProfile, setActiveProfile] = useState<string | undefined>("");
  const { profileId } = useParams<{ profileId: string }>();
  const location = useLocation();
  console.log("at", location.pathname);
  console.log("profileId", profileId);
  setActiveProfile(profileId);
  // useEffect(() => {
  //   console.log("trying to fetch researcher with id: ", profileId);
  //   axios.get(`${API_ENDPOINT}/${profileId}`).then((response) => {
  //     setResearcher({...researcher, ...response.data});
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }, [profileId]);

  if (activeProfile) {
    setResearcher(props.profiles.find(p => p.profileId === activeProfile) || emptyResearcher);
  }

  return <ResearcherProfile {...researcher} />;
}