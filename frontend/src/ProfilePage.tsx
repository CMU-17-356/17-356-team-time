import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ResearcherProfile } from "./ResearcherProfile";
import { API_ENDPOINT } from "./consts";
import { Researcher } from "./types";

export const ProfilePage = () => {

  const [researcher, setResearcher] = useState<Researcher>();
  // const [id, setProfileId] = useState<string>(useParams().profileId);
  const { profileId } = useParams<{ profileId: string }>();

  useEffect(() => {
    console.log("trying to fetch researcher with id: ", profileId);
    axios.get(`${API_ENDPOINT}/${profileId}`).then((response) => {
      setResearcher({...researcher, ...response.data});
    }).catch((error) => {
      console.log(error);
    });
  }, [profileId]);
  

  return (
    <>
    {researcher && <ResearcherProfile {...researcher} />}
    </>
  );
}