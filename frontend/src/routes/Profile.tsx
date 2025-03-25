import axios from "axios";
import { ResearcherProfile } from "../ResearcherProfile";
import { API_ENDPOINT } from "../consts";

export async function clientLoader({
  params,
}: any) {
  console.log("trying to fetch researcher with id: ", params.profileId);
  await axios.get(`${API_ENDPOINT}/${params.profileId}`).then((response) => {
    return response;
  }).catch((error) => {
    console.log(error);
  });
  return;
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export const Profile = ({
  loaderData,
}: any) => {
  console.log(loaderData, "loaderData");
  return (
    <>
    {loaderData.data && <ResearcherProfile {...loaderData.data} />}
    </>
  );
}