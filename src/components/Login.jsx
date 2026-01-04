import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from 'firebase/auth';
import toast from "react-hot-toast";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    /* ================= EMAIL LOGIN ================= */
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = await signInWithEmailAndPassword(auth, email, password);

            const token = await user.user.getIdToken();   //  🔥 Main Fix (Token get)

            if (rememberMe) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", user.user.email);
            } else {
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("user", user.user.email);
            }

            toast.success("Logged in Successfully 🎉");
            navigate('/home');

        } catch (err) {
            toast.error(err.message);
        }

        setLoading(false);
    };

    /* ================= GOOGLE LOGIN ================= */
    const googleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const token = await result.user.getIdToken();  // get token

            localStorage.setItem("token", token);
            localStorage.setItem("user", result.user.email);

            toast.success("Logged in with Google 😎");
            navigate('/home');

        } catch (err) {
            toast.error(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-10 bg-white rounded-lg shadow-md w-full max-w-md">

                <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Login 🔐</h2>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-gray-700">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 p-2 w-full border rounded"
                    />
                </div>

                {/* Password + Show Toggle */}
                <div className="mb-4 relative">
                    <label className="block text-gray-700">Password:</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 p-2 w-full border rounded pr-10"
                    />

                    <span
                        className="absolute right-3 top-10 cursor-pointer text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </span>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2 mb-3">
                    <input 
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <span>Remember me</span>
                </div>

                {/* Signup link */}
                <p 
                    className="text-blue-600 hover:underline cursor-pointer mb-2"
                    onClick={() => navigate("/signup")}
                >
                    New user? Create account
                </p>

                {/* Email Login Btn */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 text-white rounded ${
                        loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {loading ? "Please wait..." : "Login →"}
                </button>

                {/* Google Login */}
                <button
                    type="button"
                    onClick={googleLogin}
                    disabled={loading}
                    className="bg-red-500 text-white w-full py-2 rounded mt-3 hover:bg-red-600 flex items-center justify-center gap-2"
                >
                    <img src="https://img.icons8.com/color/24/google-logo.png" alt="google"/>
                    {loading ? "Connecting..." : "Sign in with Google"}
                </button>

                {/* Back Home */}
                <button 
                    type="button"
                    onClick={() => navigate('/home')}
                    className="bg-gray-300 text-gray-700 w-full py-2 rounded mt-4 hover:bg-gray-400"
                >
                    ← Back to Home
                </button>

            </form>
        </div>
    );
}

export default Login;
