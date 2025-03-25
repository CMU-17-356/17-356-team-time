import { useState } from "react";
import { useParams } from "react-router";
import { ResearcherProfile } from "./ResearcherProfile";
import { defaultResearcher } from "./consts";
import { Researcher } from "./types";

export const ProfilePage = (props: {profiles: Researcher[]}) => {
  if (props.profiles.length > 0) {
    const [researcher, setResearcher] = useState<Researcher| null>();
    const { profileId } = useParams<{ profileId: string }>();
    // useEffect(() => {
    //   console.log("trying to fetch researcher with id: ", profileId);
    //   axios.get(`${API_ENDPOINT}/${profileId}`).then((response) => {
    //     setResearcher({...researcher, ...response.data});
    //   }).catch((error) => {
    //     console.log(error);
    //   });
    // }, [profileId]);
  
    console.log("profileId", researcher);
  
    if (profileId !== researcher?.profileId) {
      setResearcher({...defaultResearcher, ...props.profiles.find(p => p.profileId === profileId)});
    }
  
    return researcher ? <ResearcherProfile {...researcher} />
    : <div>Researcher not found</div>;
  }
  return <div>Loading...</div>;
}