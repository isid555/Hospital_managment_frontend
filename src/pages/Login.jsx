import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(formData);
        if (res) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("role" , res.role);
            localStorage.setItem("id", res.data._id ) ;
            navigate("/dashboard");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-green-100">
            <form
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
                    Log in to your account
                </h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-center text-gray-600 mt-4">
                    Don’t have an account?
                    <Link to="/register" className="text-green-600 font-medium hover:underline ml-1">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
