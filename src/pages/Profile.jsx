import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`https://hospital-management-system-backend-api-1.onrender.com/api/${role}/profile`, {
                    headers: {
                        "auth-token": token,
                    },
                });

                if (res.status === 200) {
                    setProfile(res.data.data);
                    if(role === "doctor"){
                        setProfile(res.data)
                    }

                } else {
                    toast.error("Failed to load profile");
                    console.log(res)
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                toast.error("Something went wrong");
            }
        };

        if (role) {
            fetchProfile();
        }
    }, [role]);

    if (!profile) return <div className="p-6">Loading profile...</div>;

    return (
        <div>
            <Navbar/>
            <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg mt-6">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">Profile Information</h2>
                <div className="space-y-2">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <p><strong>Gender:</strong> {profile.gender}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    <p><strong>Joined At:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
