import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import bcrypt from "bcryptjs";

export default function EditProfile() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        gender: "",
        phone: "",
        password:""
    });


    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`https://hospital-management-system-backend-api-1.onrender.com/api/${role}/profile`, {
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                });

                if (res.status === 200) {



                    const { _id, name, email, gender, phone } = res.data;

                    console.log(res)

                    setFormData({ name, email, gender, phone });

                    if(role === "nurse" || role=== "patient" || role === "admin"){
                        const { _id, name, email, gender, phone } = res.data.data;
                        setFormData({ name, email, gender, phone });
                    }

                } else {
                    toast.error("Failed to fetch profile.");

                }
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong.");

            }
        };

        fetchProfile();
    }, [role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (formData.password !== " ") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(formData.password, salt);
            formData.password = hashedPassword;
        }else{
            delete  formData.password ;
        }



        try {
            const res = await axios.put(
                `https://hospital-management-system-backend-api-1.onrender.com/api/${role}/profile`,
                formData,
                {
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                }
            );

            if (res.status === 200) {
                toast.success("Profile updated successfully!");
            } else {
                toast.error("Failed to update profile.");
                console.log(res)
            }
        } catch (err) {
            console.error(err);
            toast.error("Error updating profile.");
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg mt-6">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || " "}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || " "}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender || " "}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || " "}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Password</label>
                        <input
                            type="text"
                            name="password"
                            value={formData.password || " "}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
