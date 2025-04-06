import {useAdminActions} from "../hooks/useAdminActions.js";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import PatientDashboard from "./PatientDashboard.jsx";


export default function AdminDashboard() {
    let role = localStorage.getItem("role")
    let isAdmin = role === 'admin'
    const {
        loading,
        getPendingDoctors,
        getPendingNurses,
        approveDoctor,
        rejectDoctor,
        approveNurse,
        rejectNurse,
        getApprovedDoctors,
        getApprovedNurses,
        removeDoctor,
        removeNurse
    } = useAdminActions();

    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [pendingNurses, setPendingNurses] = useState([]);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [totalNurses, setTotalNurses] = useState(0);

    const [approvedDoctors, setApprovedDoctors] = useState([]);
    const [approvedNurses, setApprovedNurses] = useState([]);



    useEffect(() => {
        const fetchPendingCounts = async () => {
            const doctorsRes = await getPendingDoctors();
            const nursesRes = await getPendingNurses();
            const totDoctors = await getApprovedDoctors();
            const totNurses = await getApprovedNurses();

            if (doctorsRes?.data) setPendingDoctors(doctorsRes.data);
            if (nursesRes?.data) setPendingNurses(nursesRes.data);
            if (totDoctors?.data) {
                setTotalDoctors(totDoctors.data.length);
                setApprovedDoctors(totDoctors.data);
            }
            if (totNurses?.data) {
                setTotalNurses(totNurses.data.length);
                setApprovedNurses(totNurses.data);
            }
        };

        if (isAdmin) fetchPendingCounts();
    }, [isAdmin]);

    const handleApproval = async (id, action) => {
        let res = null;

        if (action === "approve") {
            res = await approveDoctor(id);
            if (res?.success) {
                setPendingDoctors(prev => prev.filter(doc => doc._id !== id));
                toast.success("Doctor approved");
            }
        } else if (action === "reject") {
            res = await rejectDoctor(id);
            if (res?.success) {
                setPendingDoctors(prev => prev.filter(doc => doc._id !== id));
                toast.success("Doctor rejected");
            }
        } else if (action === "approve-nurse") {
            res = await approveNurse(id);
            if (res?.success) {
                setPendingNurses(prev => prev.filter(nurse => nurse._id !== id));
                toast.success("Nurse approved");
            }
        } else if (action === "reject-nurse") {
            res = await rejectNurse(id);
            if (res?.success) {
                setPendingNurses(prev => prev.filter(nurse => nurse._id !== id));
                toast.success("Nurse rejected");
            }
        }
    };

    const handleRemoveUser = async (id, role) => {
        let res = null;

        if (role === "doctor") {
            res = await removeDoctor(id);
            if (res?.success) {
                setApprovedDoctors(prev => prev.filter(doc => doc._id !== id));
                setTotalDoctors(prev => prev - 1);
                toast.success("Doctor removed");
            }
        } else if (role === "nurse") {
            res = await removeNurse(id);
            if (res?.success) {
                setApprovedNurses(prev => prev.filter(nurse => nurse._id !== id));
                setTotalNurses(prev => prev - 1);
                toast.success("Nurse removed");
            }
        }
    };


    const totalPending = pendingDoctors.length + pendingNurses.length;

    return(
        <div>
            <div className="mt-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4">Admin Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="Total Doctors Approved" value={totalDoctors} color="blue" />
                    <StatCard label="Total Nurses Approved" value={totalNurses} color="green" />
                    <StatCard label="Pending Approvals" value={totalPending} color="yellow" />
                </div>

                {/* 🔽 Pending Doctors List */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">Pending Doctors</h3>
                    {pendingDoctors.length === 0 ? (
                        <p className="text-gray-500">No pending doctors.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingDoctors.map(doc => (
                                <div key={doc._id} className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="text-md font-semibold">{doc.name}</h4>
                                        <p className="text-sm text-gray-500">{doc.email}</p>
                                        <p className="text-sm text-gray-400">Phone: {doc.phone}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                                            onClick={() => handleApproval(doc._id, "approve")}
                                            disabled={loading}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                            onClick={() => handleApproval(doc._id, "reject")}
                                            disabled={loading}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🔽 Pending Nurses List */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">Pending Nurses</h3>
                    {pendingNurses.length === 0 ? (
                        <p className="text-gray-500">No pending nurses.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingNurses.map(nurse => (
                                <div key={nurse._id} className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="text-md font-semibold">{nurse.name}</h4>
                                        <p className="text-sm text-gray-500">{nurse.email}</p>
                                        <p className="text-sm text-gray-400">Phone: {nurse.phone}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                                            onClick={() => handleApproval(nurse._id, "approve-nurse")}
                                            disabled={loading}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                            onClick={() => handleApproval(nurse._id, "reject-nurse")}
                                            disabled={loading}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* ✅ Approved Doctors */}
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-3 text-gray-800">Approved Doctors</h3>
                {approvedDoctors.length === 0 ? (
                    <p className="text-gray-500">No approved doctors yet.</p>
                ) : (
                    <div className="space-y-4">
                        {approvedDoctors.map(doc => (
                            <div key={doc._id} className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="text-md font-semibold">{doc.name}</h4>
                                    <p className="text-sm text-gray-500">{doc.email}</p>
                                    <p className="text-sm text-gray-400">Phone: {doc.phone}</p>
                                </div>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                    onClick={() => handleRemoveUser(doc._id, "doctor")}
                                    disabled={loading}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ✅ Approved Nurses */}
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-3 text-gray-800">Approved Nurses</h3>
                {approvedNurses.length === 0 ? (
                    <p className="text-gray-500">No approved nurses yet.</p>
                ) : (
                    <div className="space-y-4">
                        {approvedNurses.map(nurse => (
                            <div key={nurse._id} className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="text-md font-semibold">{nurse.name}</h4>
                                    <p className="text-sm text-gray-500">{nurse.email}</p>
                                    <p className="text-sm text-gray-400">Phone: {nurse.phone}</p>
                                </div>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                    onClick={() => handleRemoveUser(nurse._id, "nurse")}
                                    disabled={loading}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>


        </div>
    )
}

function StatCard({ label, value, color }) {
    const colorMap = {
        blue: "text-blue-600",
        green: "text-green-600",
        yellow: "text-yellow-500",
    };

    return (
        <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-lg font-semibold">{label}</h2>
            <p className={`text-2xl mt-2 font-bold ${colorMap[color]}`}>{value}</p>
        </div>
    );
}
