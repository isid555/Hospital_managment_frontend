import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {backendURL} from "../../constant.js";

export default function NurseDashboard() {
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${backendURL}/patient`, {
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                });

                if (res.status === 200) {
                    // console.log(res)
                    const allUsers = res.data.users;
                    const patientUsers = allUsers.filter(user => user.role === "patient");
                    setPatients(patientUsers);
                }

            } catch (err) {
                toast.error("Failed to load patients");
            }
        };

        fetchUsers();
    }, []);

    const handlePatientClick = async (patientId) => {
        setSelectedPatientId(patientId);
        try {
            const [appointmentsRes, prescriptionsRes] = await Promise.all([
                axios.get(`${backendURL}/appointment/all-by-user?userId=${patientId}`, {
                    headers: { "auth-token": localStorage.getItem("token") },
                }),
                // axios.get(`https://hospital-management-system-backend-api-1.onrender.com/api/prescription/by-user/${patientId}`, {
                //     headers: { "auth-token": localStorage.getItem("token") },
                // }),
            ]);

            console.log(appointmentsRes)
            const activeAppointments = appointmentsRes.data.data.filter(app => app.status !== 'cancelled');
            setAppointments(activeAppointments);
            // setPrescriptions(prescriptionsRes.data.data || []);
        } catch (err) {
            toast.error("Failed to fetch data for this patient");
            setAppointments([]);
            setPrescriptions([]);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-pink-700">Welcome to the DashBoard , Nurse</h2>

            <h6 className="text-lg font-bold mb-4 text-pink-700">Patients of our hospital</h6>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {patients.map((p) => (
                    <div
                        key={p._id}
                        className="p-4 border rounded shadow cursor-pointer hover:bg-gray-50 bg-white"
                        onClick={() => handlePatientClick(p._id)}
                    >
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-gray-600">{p.email}</p>
                        <p className="text-sm text-gray-500 capitalize">{p.gender}</p>
                    </div>
                ))}
            </div>

            {selectedPatientId && (
                <div className="space-y-8">
                    {/* Appointments */}
                    <div>
                        <h3 className="text-xl font-bold text-blue-700 mb-2">Appointments</h3>
                        {appointments.length === 0 ? (
                            <p>No appointments found.</p>
                        ) : (
                            <ul className="space-y-3">
                                {appointments.map((a) => (
                                    <li
                                        key={a._id}
                                        className="p-4 bg-gray-100 border rounded shadow"
                                    >
                                        <p><strong>Date:</strong> {new Date(a.date).toLocaleString()}</p>
                                        <p><strong>Reason:</strong> {a.reason}</p>
                                        <p><strong>Status:</strong> <span className="capitalize">{a.status}</span></p>
                                        <p><strong>Doctor:</strong> Dr. {a.doctor?.name || "N/A"}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Prescriptions */}
                    {/*<div>*/}
                    {/*    <h3 className="text-xl font-bold text-green-700 mb-2">Prescriptions</h3>*/}
                    {/*    {prescriptions.length === 0 ? (*/}
                    {/*        <p>No prescriptions found.</p>*/}
                    {/*    ) : (*/}
                    {/*        <ul className="space-y-3">*/}
                    {/*            {prescriptions.map((p) => (*/}
                    {/*                <li*/}
                    {/*                    key={p._id}*/}
                    {/*                    className="p-4 bg-white border rounded shadow"*/}
                    {/*                >*/}
                    {/*                    <p><strong>Medication:</strong> {p.medication}</p>*/}
                    {/*                    <p><strong>Dosage:</strong> {p.dosage}</p>*/}
                    {/*                    <p><strong>Frequency:</strong> {p.frequency}</p>*/}
                    {/*                    <p><strong>Start:</strong> {new Date(p.startDate).toLocaleDateString()}</p>*/}
                    {/*                    <p><strong>End:</strong> {new Date(p.endDate).toLocaleDateString()}</p>*/}
                    {/*                </li>*/}
                    {/*            ))}*/}
                    {/*        </ul>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                </div>
            )}
        </div>
    );
}
