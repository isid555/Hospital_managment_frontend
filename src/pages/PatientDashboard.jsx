import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PrescriptionViewModal from "../components/PrescriptionViewModal";


export default function PatientDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({ date: "", reason: "" });
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);


    const userId = localStorage.getItem("id");

    // Fetch doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/admin/approved-doctors", {
                    headers: { "auth-token": localStorage.getItem("token") },
                });

                if (res.data.success) {
                    setDoctors(res.data.data);
                }
            } catch (err) {
                toast.error("Failed to load doctors");
            }
        };

        fetchDoctors();
    }, []);

    // Fetch all appointments of patient
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/appointment/my-appointments", {
                    headers: { "auth-token": localStorage.getItem("token") },
                });

                if (res.data.success) {
                    setAppointments(res.data.data);
                }
            } catch (err) {
                toast.error("Failed to load appointments");
            }
        };

        fetchAppointments();
    }, []);

    const handleAppointmentClick = async (appointment) => {
        setSelectedAppointment(appointment);
        if (appointment.status !== "completed") {
            toast.error("Prescription is only available for completed appointments.");
            return;
        }
        try {
            const res = await axios.get(
                `http://localhost:3000/api/prescription/by-user-doctor?userId=${userId}&doctorId=${appointment.doctor._id}`,
                {
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                }
            );

            if (res.status === 200) {
                setPrescriptions(res.data.data);
                setShowPrescriptionModal(true);
            } else {
                setPrescriptions([]);
            }
        } catch (err) {
            toast.error("Error loading prescriptions.");
            setPrescriptions([]);
        }
    };

    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();

        if (!formData.date || !formData.reason) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:3000/api/appointment/",
                {
                    user: userId,
                    doctor: selectedDoctor._id,
                    date: formData.date,
                    reason: formData.reason,
                },
                {
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                }
            );

            if (res.status === 201  ) {
                toast.success("Appointment created successfully!");
                setAppointments((prev) => [...prev, res.data.data]);
                setFormData({ date: "", reason: "" });
                setShowAppointmentModal(false);
            } else {
                toast.error("Failed to create appointment.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-10">

            <h2 className="text-2xl font-bold mb-4 text-green-700">Welcome to Siddharth Hospitals</h2>

            <h2 className="text-2xl font-bold mb-4 text-green-700">We wish you a speedy recovery , dear PATIENT</h2>


            {/* Doctors list */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-green-700">Available Doctors</h2>
                <ul className="space-y-4">
                    {doctors.map((doc) => (
                        <li
                            key={doc._id}
                            className="p-4 border rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                                setSelectedDoctor(doc);
                                setSelectedAppointment(null);
                                setPrescriptions([]);
                            }}
                        >
                            <div>
                                <p className="text-lg font-semibold text-green-800">Dr . {doc.name}</p>
                                <p className="text-gray-600">{doc.specialization || "General Practitioner"}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Selected Doctor Info */}
            {selectedDoctor && (
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-blue-700">
                        Appointments with Dr. {selectedDoctor.name}
                    </h2>

                    {appointments.filter(app => app.doctor._id === selectedDoctor._id).length === 0 ? (
                        <p className="text-gray-600">You have no appointments with this doctor yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {appointments
                                .filter(app => app.doctor._id === selectedDoctor._id)
                                .map((app) => (
                                    <li
                                        key={app._id}
                                        onClick={() => handleAppointmentClick(app)}
                                        className="p-4 border rounded bg-white shadow hover:bg-gray-50 cursor-pointer"
                                    >
                                        <p><strong>Date:</strong> {new Date(app.date).toLocaleString()}</p>
                                        <p><strong>Reason:</strong> {app.reason}</p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span
                                                className={`capitalize font-semibold ${
                                                    app.status === "completed"
                                                        ? "text-green-600"
                                                        : app.status === "cancelled"
                                                            ? "text-red-600"
                                                            : "text-gray-700"
                                                }`}
                                            >
    {app.status}
  </span>
                                            {app.status === "completed" && (
                                                <span className="ml-2 text-sm text-green-700 italic">
      (Check prescription)
    </span>
                                            )}
                                        </p>

                                    </li>
                                ))}
                        </ul>
                    )}

                    {/*/!* Prescription Section *!/*/}
                    {/*{selectedAppointment && prescriptions.length > 0 && (*/}
                    {/*    <div className="mt-4">*/}
                    {/*        <h3 className="text-lg font-semibold text-purple-700 mb-2">*/}
                    {/*            Prescriptions for appointment on {new Date(selectedAppointment.date).toLocaleString()}*/}
                    {/*        </h3>*/}
                    {/*        <ul className="space-y-3">*/}
                    {/*            {prescriptions.map((p) => (*/}
                    {/*                <li key={p._id} className="p-4 bg-gray-100 border rounded">*/}
                    {/*                    <p><strong>Medication:</strong> {p.medication}</p>*/}
                    {/*                    <p><strong>Dosage:</strong> {p.dosage}</p>*/}
                    {/*                    <p><strong>Frequency:</strong> {p.frequency}</p>*/}
                    {/*                    <p><strong>Start:</strong> {new Date(p.startDate).toLocaleDateString()}</p>*/}
                    {/*                    <p><strong>End:</strong> {new Date(p.endDate).toLocaleDateString()}</p>*/}
                    {/*                </li>*/}
                    {/*            ))}*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/* Book New Appointment Button */}
                    <div className="mt-6">
                        <button
                            onClick={() => setShowAppointmentModal(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Book New Appointment
                        </button>
                    </div>
                </section>
            )}

            {/* Appointment Booking Modal */}
            {showAppointmentModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                        <h3 className="text-xl font-bold mb-4 text-green-700">
                            Book Appointment with Dr. {selectedDoctor?.name}
                        </h3>
                        <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium mb-1">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Reason</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    className="w-full border p-2 rounded"
                                    placeholder="Describe your issue"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAppointmentModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showPrescriptionModal && (
                <PrescriptionViewModal
                    prescriptions={prescriptions}
                    onClose={() => setShowPrescriptionModal(false)}
                />
            )}

        </div>
    );
}
