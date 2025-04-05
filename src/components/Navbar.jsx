import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const getProfilePath = () => {
        if (!role) return "/login";
        return `/profile`;
    };

    return (
        <nav className="bg-green-600 text-white px-4 py-3 shadow flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Siddharth Hospitals</Link>
            <div className="space-x-4">
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                        <Link to={getProfilePath()} className="hover:underline">Profile</Link>
                        <Link to="/edit-profile" className="hover:underline">Edit Profile</Link>
                        <button onClick={handleLogout} className="hover:underline">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
