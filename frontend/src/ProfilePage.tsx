import { useState } from "react";
import { useParams } from "react-router";
import { ResearcherProfile } from "./ResearcherProfile";
import { defaultResearcher } from "./consts";
import { Researcher } from "./types";

export const ProfilePage = (props: {profiles: Researcher[]}) => {
  if (props.profiles.length > 0) {
    const [researcher, setResearcher] = useState<Researcher| null>();
    const { userId } = useParams<{ userId: string }>();
    // useEffect(() => {
    //   console.log("trying to fetch researcher with id: ", userId);
    //   axios.get(`${API_ENDPOINT}/${userId}`).then((response) => {
    //     setResearcher({...researcher, ...response.data});
    //   }).catch((error) => {
    //     console.log(error);
    //   });
    // }, [userId]);
  
    console.log("userId", researcher);
  
    if (userId !== researcher?.userId) {
      setResearcher({...defaultResearcher, ...props.profiles.find(p => p.userId === userId)});
    }
  
    return researcher ? <ResearcherProfile {...researcher} />
    : <div>Researcher not found</div>;
  }
  return <div>Loading...</div>;
}