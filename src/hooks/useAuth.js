import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
    baseURL: "https://hospital-management-system-backend-api-1.onrender.com/api",
    withCredentials: true,
});

export const useAuth = () => {
    const [loading, setLoading] = useState(false);

    const login = async (formData) => {
        try {
            setLoading(true);
            const res = await API.post("/auth/login", formData);
            toast.success("Login successful");
            console.log("✅ Login Success:", res.data);
            return res.data;
        } catch (err) {
            console.error("❌ Login Error:", err);
            toast.error(err.response?.data?.message || "Login failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        try {
            setLoading(true);
            const res = await API.post("/auth/register", formData);
            toast.success("Registration successful");
            console.log("✅ Registration Success:", res.data);
            return res.data;
        } catch (err) {
            console.error("❌ Register Error:", err);
            toast.error(err.response?.data?.message || "Registration failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, register, loading };
};
