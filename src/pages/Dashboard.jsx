import { useEffect, useState } from "react";
import PatientDashboard from "./PatientDashboard.jsx";
import DoctorDashboard from "./DoctorDashboard.jsx";
import NurseDashboard from "./NurseDashboard.jsx";
import AdminDashboard from "./AdminDashBoard.jsx";

const images = [
    "/img.png",
    "/img_1.png",
    "/img_2.png",
];

export default function Dashboard() {
    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";
    const isUser = role === "patient";
    const isDoctor = role === "doctor";
    const isNurse = role === "nurse";

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
        }, 2300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="p-6">
                <h1 className="text-3xl font-bold text-green-700 text-center">
                    Welcome to Siddharth Hospital's Management Dashboard
                </h1>
                <p className="mt-2 text-gray-600 text-center">
                    This is a protected page. Only logged-in users can access it.
                </p>
            </div>

            {/* Smooth Sliding Full-Width Carousel */}
            <div className="relative w-full overflow-hidden h-[400px]">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentImage * 100}%)` }}
                >
                    {images.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Slide ${index}`}
                            className="w-full h-[400px] object-cover object-center flex-shrink-0"
                        />
                    ))}
                </div>
            </div>

            {/* Role-Based Dashboards */}
            <div className="mt-8 px-6">
                {isAdmin && <AdminDashboard />}
                {isUser && <PatientDashboard />}
                {isDoctor && <DoctorDashboard />}
                {isNurse && <NurseDashboard />}
            </div>
        </div>
    );
}
