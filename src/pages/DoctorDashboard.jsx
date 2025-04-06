import { useState } from "react";
import useDoctorAppointments from "../hooks/useDoctorAppointments";
import PrescriptionModal from "./../components/PrescriptionModal.jsx";
import usePrescription from "../hooks/usePrescription.js";
import PrescriptionViewModal from "../components/PrescriptionViewModal";


export default function DoctorDashboard() {
    const {
        appointments,
        rescheduleData,
        setRescheduleData,
        handleApprove,
        handleReject,
        handleReschedule,
        patients,
        selectedPatientId,
        setSelectedPatientId,
    } = useDoctorAppointments();

    const [prescriptionAppointment, setPrescriptionAppointment] = useState(null);

    const [showPrescriptions, setShowPrescriptions] = useState(false);
    const { prescriptions, fetchPrescriptionsByUserAndDoctor } = usePrescription();

    const [viewPrescriptions, setViewPrescriptions] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);


    const filteredAppointments = appointments.filter(
        (appt) => appt.user?._id === selectedPatientId
    );

    const handleViewPrescriptions = async () => {
        if (!selectedPatientId) return;
        const doctorID = localStorage.getItem("id");
        await fetchPrescriptionsByUserAndDoctor(selectedPatientId, doctorID);
        setShowPrescriptions(true);
    };




    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Welcome to the Dashboard , Doctor</h2>

            <h6 className="text-2xl font-bold mb-6 text-green-700">Your Patients</h6>
            {/* Patient List */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {patients.map((p) => (
                    <div
                        key={p._id}
                        onClick={() => setSelectedPatientId(p._id)}
                        className={`p-4 border rounded cursor-pointer hover:bg-blue-100 ${
                            selectedPatientId === p._id ? "bg-blue-200" : "bg-white"
                        }`}
                    >
                        <p className="font-semibold text-blue-800">{p.name}</p>
                        <p className="text-sm text-gray-600">{p.email}</p>
                    </div>
                ))}
            </div>

            {/* Appointments */}
            {filteredAppointments.length === 0 ? (
                <p className="text-gray-600">.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredAppointments.map((appt) => (
                        <li
                            key={appt._id}
                            className="p-4 border rounded-lg shadow bg-white space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p><strong>Patient:</strong> {appt.user?.name || "Unknown"}</p>
                                    <p><strong>Date:</strong> {new Date(appt.date).toLocaleString()}</p>
                                    <p><strong>Reason:</strong> {appt.reason}</p>
                                    <p><strong>Status:</strong> <span className="capitalize">{appt.status}</span></p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => setPrescriptionAppointment(appt)}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                    >
                                        Write Prescription
                                    </button>
                                    <button
                                        onClick={() =>
                                            setRescheduleData({id: appt._id, date: ""})
                                        }
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    >
                                        Reschedule
                                    </button>
                                    <button
                                        onClick={() => handleReject(appt._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                    {appt.status !== 'cancelled' && (
                                        <button
                                            onClick={async () => {
                                                const prescriptions = await fetchPrescriptionsByUserAndDoctor(
                                                    appt.user._id,
                                                    localStorage.getItem("id"),
                                                );
                                                setViewPrescriptions(prescriptions);
                                                setShowViewModal(true);
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            View Prescriptions
                                        </button>

                                    )}

                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Reschedule Modal */}
            {rescheduleData.id && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4 text-blue-700">Reschedule Appointment</h3>
                        <input
                            type="datetime-local"
                            className="w-full border p-2 rounded mb-4"
                            value={rescheduleData.date}
                            onChange={(e) =>
                                setRescheduleData((prev) => ({
                                    ...prev,
                                    date: e.target.value,
                                }))
                            }
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setRescheduleData({id: null, date: ""})}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReschedule}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Prescription Modal */}
            {prescriptionAppointment && (
                <PrescriptionModal
                    appointment={prescriptionAppointment}
                    onClose={() => setPrescriptionAppointment(null)}
                />
            )}

            {/* Prescription View Modal */}
            {showViewModal && (
                <PrescriptionViewModal
                    prescriptions={viewPrescriptions}
                    onClose={() => setShowViewModal(false)}
                />
            )}

        </div>
    );
}
