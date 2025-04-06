import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useDoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [rescheduleData, setRescheduleData] = useState({ id: null, date: "" });
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get("https://hospital-management-system-backend-api-1.onrender.com/api/appointment/my-appointments", {
                headers: {
                    "auth-token": localStorage.getItem("token"),
                },
            });

            if (res.data.success) {
                const appts = res.data.data;
                setAppointments(appts);

                // Extract unique patient list
                const patientMap = {};
                appts.forEach((appt) => {
                    if (appt.user && !patientMap[appt.user._id]) {
                        patientMap[appt.user._id] = appt.user;
                    }
                });

                setPatients(Object.values(patientMap));
            }
        } catch (err) {
            console.error("Failed to fetch appointments", err);
            toast.error("Failed to load appointments");
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(
                `https://hospital-management-system-backend-api-1.onrender.com/api/appointment/complete/${id}`,
                { status: "scheduled" },
                {
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                }
            );
            toast.success("Appointment approved");
            fetchAppointments();
        } catch (err) {
            toast.error("Failed to approve appointment");
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(
                `https://hospital-management-system-backend-api-1.onrender.com/api/appointment/cancel/${id}`,
                {},
                {
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                }
            );
            toast.success("Appointment rejected");
            fetchAppointments();
        } catch (err) {
            toast.error("Failed to reject appointment");
        }
    };

    const handleReschedule = async () => {
        if (!rescheduleData.id || !rescheduleData.date) return;

        try {
            await axios.put(
                `https://hospital-management-system-backend-api-1.onrender.com/api/appointment/${rescheduleData.id}`,
                { date: rescheduleData.date },
                {
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                }
            );
            toast.success("Appointment rescheduled");
            setRescheduleData({ id: null, date: "" });
            fetchAppointments();
        } catch (err) {
            toast.error("Failed to reschedule");
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return {
        appointments,
        rescheduleData,
        setRescheduleData,
        handleApprove,
        handleReject,
        handleReschedule,
        patients,
        selectedPatientId,
        setSelectedPatientId,
    };
};

export default useDoctorAppointments;
