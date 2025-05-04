import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Updated import
import { PROFILE_API_ENDPOINT } from "../consts";
import { Researcher } from "../types";

export default function LandingPage() {
  const [profiles, setProfiles] = useState<Researcher[]>([]);

  useEffect(() => {
    axios
      .get(PROFILE_API_ENDPOINT)
      .then((response) => {
        if (response.data.profiles) {
          setProfiles(response.data.profiles);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffffff]">
      <img
        src="/reach_full_logo.png"
        alt="Reach logo"
        className="w-auto h-62 block -mb-22"
      />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center flex flex-col gap-2">
        <NavLink
          className="w-full bg-[#A9CEEF] text-white py-2 rounded hover:bg-[#86BBE9] flex justify-center items-center"
          to="/login"
        >
          {"Login"}
        </NavLink>
        <NavLink
          className="w-full bg-[#A9CEEF] text-white py-2 rounded mb-2 hover:bg-[#86BBE9] flex justify-center items-center"
          to={"/register"}
        >
          {"Register"}
        </NavLink>
      </div>
      {profiles.length > 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center mt-8">
          <h2 className="text-xl font-semibold mb-4">Registered Users:</h2>
          <div className="flex flex-row flex-wrap gap-2">
            {profiles.map((p) => (
              <NavLink
                key={p.userId}
                to={`profile/${p.userId}`}
                className="bg-blue-200 text-slate-700 h-10 w-20 rounded-lg flex justify-center items-center px-2"
              >
                {p.userId}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
