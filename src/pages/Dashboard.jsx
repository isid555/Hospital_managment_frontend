import { useEffect, useState } from "react";
import { useAdminActions } from "../hooks/useAdminActions";
import toast from "react-hot-toast";

export default function Dashboard() {
    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";

    const {
        loading,
        getPendingDoctors,
        getPendingNurses,
        approveDoctor,
        rejectDoctor,
        getApprovedDoctors,
        getApprovedNurses
    } = useAdminActions();

    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [pendingNurseCount, setPendingNurseCount] = useState(0);
    const [totalDoctors,settotalDoctors] = useState(0);
    const [totalNurses , settotalNurses] = useState(0);


    useEffect(() => {
        const fetchPendingCounts = async () => {
            const doctorsRes = await getPendingDoctors();
            const nursesRes = await getPendingNurses();

            const totDoctors = await getApprovedDoctors();
            const totNurses  = await getApprovedNurses()

            if (doctorsRes?.data) setPendingDoctors(doctorsRes.data);
            if (nursesRes?.data) setPendingNurseCount(nursesRes.data.length);

            if (totDoctors?.data) settotalDoctors(doctorsRes.data.length);
            if (totNurses?.data) settotalNurses(nursesRes.data.length);
        };

        if (isAdmin) fetchPendingCounts();
    }, [isAdmin]);

    const handleApproval = async (id, action) => {
        let success = false;
        if (action === "approve") {
            const res = await approveDoctor(id);
            if (res?.success) {
                setPendingDoctors(prev => prev.filter(doc => doc._id !== id));
            }
        } else if (action === "reject") {
            const res = await rejectDoctor(id);
            if (res?.success) {
                setPendingDoctors(prev => prev.filter(doc => doc._id !== id));
            }
        }

        if (success) {
            setPendingDoctors(prev => {
                const updatedList = prev.filter(doc => doc._id !== id);
                return updatedList;
            });
        }
    };

    const totalPending = pendingDoctors.length + pendingNurseCount;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-semibold text-green-700">
                Welcome to Siddharth Hospital's Management Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
                This is a protected page. Only logged-in users can access it.
            </p>

            {isAdmin && (
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
                </div>
            )}
        </div>
    );
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
