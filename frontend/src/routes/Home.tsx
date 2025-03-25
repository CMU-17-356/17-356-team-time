import axios from "axios";
import { useState } from "react";
import { NavLink } from "react-router";
import { API_ENDPOINT, defaultResearcher, emptyResearcher } from "../consts";
import { Researcher } from "../types";

export const Home = (props: {profiles: Researcher[]}) => {
  const [researcher, setResearcher] = useState(emptyResearcher);

  const createProfile = () => {
    if (researcher.profileId === "nouser") {
      console.log("trying to create researcher with id: ", defaultResearcher.profileId);
      axios.post(API_ENDPOINT, defaultResearcher)
      .then((response) => {
        setResearcher({...defaultResearcher, ...response.data});
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
    } else {
      console.log("researcher already exists");
    }
  }
  console.log("all profiles", props.profiles);
  return <div className="w-full h-full bg-indigo-900 flex flex-row justify-center items-center">
  <div className="w-10 h-10 rounded-lg bg-blue-500" onClick={createProfile}>Make</div>
  <div>
    {props.profiles.map(p => <NavLink to={`profile/${p.profileId}`} className="bg-red-500 text-white h-10 w-20 rounded-lg block">{p.profileId}</NavLink>)}
  </div>
  </div>
}