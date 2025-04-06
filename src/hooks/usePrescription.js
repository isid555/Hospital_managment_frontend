import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://hospital-management-system-backend-api-1.onrender.com/api/prescription";

export default function usePrescription() {
    const [loading, setLoading] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    const token = localStorage.getItem("token");

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(BASE_URL, {
                headers: { "auth-token": token }
            });
            setPrescriptions(res.data.data || []);
        } catch (err) {
            toast.error("Failed to fetch prescriptions");
        } finally {
            setLoading(false);
        }
    };

    const fetchPrescriptionsByUserAndDoctor = async (userId, doctorId) => {
        const res = await axios.get(
            `https://hospital-management-system-backend-api-1.onrender.com/api/prescription/by-user-doctor?userId=${userId}&doctorId=${doctorId}`,
            {
                headers: {
                    "auth-token": localStorage.getItem("token"),
                },
            }
        );
        setPrescriptions(res);
        return res.data.data;
    };

    const createPrescription = async (data) => {
        try {
            const res = await axios.post(`https://hospital-management-system-backend-api-1.onrender.com/api/prescription/create`, data, {
                headers: { "auth-token": token }
            });
            toast.success("Prescription created");
            return res.data.data;
        } catch (err) {
            toast.error("Failed to create prescription");
            console.log(err)
            throw err;
        }
    };

    const updatePrescription = async (id, data) => {
        try {
            const res = await axios.put(`${BASE_URL}/${id}`, data, {
                headers: { "auth-token": token }
            });
            toast.success("Prescription updated");
            return res.data.data;
        } catch (err) {
            toast.error("Failed to update prescription");
            throw err;
        }
    };

    const deletePrescription = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`, {
                headers: { "auth-token": token }
            });
            toast.success("Prescription deleted");
            fetchPrescriptions(); // Refresh after deletion
        } catch (err) {
            toast.error("Failed to delete prescription");
        }
    };

    const getPrescriptionById = async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/${id}`, {
                headers: { "auth-token": token }
            });
            setSelectedPrescription(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch prescription");
        }
    };

    const getPrescriptionsByUserAndDoctor = async (userId, doctorId) => {
        const res = await axios.get(`/prescription/by-user-doctor`, {
            params: { userId, doctorId },
        });
        return res.data.data;
    };



    return {
        loading,
        prescriptions,
        selectedPrescription,
        fetchPrescriptions,
        createPrescription,
        updatePrescription,
        deletePrescription,
        getPrescriptionById,
        fetchPrescriptionsByUserAndDoctor,
        getPrescriptionsByUserAndDoctor
    };
}
