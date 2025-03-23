import { useState } from "react";
import ResearcherProfile from "./ProfilePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ResearcherProfile />
    </>
  );
}

export default App;
