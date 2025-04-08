import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fce6d2]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center flex flex-col gap-2">
        <h2 className="text-2xl font-bold mb-4">Reach</h2>
        <button className="w-full bg-[#faab99] text-white py-2 rounded hover:bg-[#f89686] justify-center items-center">
          {"Login"}
        </button>
        <NavLink
          className="w-full bg-[#faab99] text-white py-2 rounded mb-2 hover:bg-[#f89686] flex justify-center items-center"
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
