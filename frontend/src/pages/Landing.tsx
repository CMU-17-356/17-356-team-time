import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fce6d2]">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
            <h2 className="text-2xl font-bold mb-4">Reach</h2>

                <button className="w-full bg-[#faab99] text-white py-2 rounded mb-2 hover:bg-[#f89686]">
                    {"Login"}
                </button>

                <button className="w-full bg-[#faab99] text-white py-2 rounded mb-2 hover:bg-[#f89686]"
                    onClick={() => navigate("/register")}>
                    {"Register"}
                </button>

            </div>
        </div>
    );
}