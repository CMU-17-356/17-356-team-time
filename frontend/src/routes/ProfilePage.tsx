import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ResearcherProfile } from "../components/ResearcherProfile";
import { API_ENDPOINT, emptyResearcher } from "../consts";
import { Researcher } from "../types";

export const ProfilePage = () => {
    const [researcher, setResearcher] = useState<Researcher | null>();
    const { userId } = useParams<{ userId: string }>();
    useEffect(() => {
      console.log("trying to fetch researcher with id: ", userId);
      axios.get(`${API_ENDPOINT}/${userId}`).then((response) => {
        setResearcher({...emptyResearcher, ...response.data});
      }).catch((error) => {
        console.log(error);
      });
    }, []);
  
    return researcher ? <ResearcherProfile {...researcher} /> : <div>Loading...</div>
}