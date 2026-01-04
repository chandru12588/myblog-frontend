import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <button 
            onClick={handleLogout} 
            className="bg-gray-700 text-white py-1 px-3 rounded hover:bg-black"
        >
            Logout
        </button>
    );
}
