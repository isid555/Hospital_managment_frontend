import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {backendURL} from "../../constant.js";
const API = axios.create({
    baseURL: backendURL,
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["auth-token"] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});




export const useAdminActions = () => {
    const [loading, setLoading] = useState(false);

    const handleRequest = async (action, successMsg) => {
        try {
            setLoading(true);
            const res = await action();
            toast.success(successMsg);
            return res.data;
        } catch (err) {
            console.error("❌ Admin action error:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getPendingDoctors = () =>
        handleRequest(
            () => API.get("/admin/pending-doctors"),
            "Fetched pending doctors"
        );

    const getPendingNurses = () =>
        handleRequest(
            () => API.get("/admin/pending-nurses"),
            "Fetched pending nurses"
        );

    const getApprovedDoctors = () =>
        handleRequest(
            () => API.get("/admin/approved-doctors"),
            "Fetched pending doctors"
        );

    const getApprovedNurses = () =>
        handleRequest(
            () => API.get("/admin/approved-nurses"),
            "Fetched pending nurses"
        );

    const approveDoctor = (id) =>
        handleRequest(
            () => API.put(`/admin/approve-doctor/${id}`),
            "Doctor approved"
        );

    const rejectDoctor = (id) =>
        handleRequest(
            () => API.put(`/admin/reject-doctor/${id}`),
            "Doctor rejected"
        );

    const approveNurse = (id) =>
        handleRequest(
            () => API.put(`/admin/approve-nurse/${id}`),
            "Nurse approved"
        );

    const rejectNurse = (id) =>
        handleRequest(
            () => API.put(`/admin/reject-nurse/${id}`),
            "Nurse rejected"
        );

    const removeDoctor = async (id) => {
        try {
            const res = await axios.delete(`${backendURL}/admin/remove-doctor/${id}`, {
                headers: { "auth-token": localStorage.getItem("token") },
            });
            return res.data;
        } catch (err) {
            toast.error("Failed to remove doctor");
            return null;
        }
    };

    const removeNurse = async (id) => {
        try {
            const res = await axios.delete(`${backendURL}/admin/remove-nurse/${id}`, {
                headers: { "auth-token": localStorage.getItem("token") },
            });
            return res.data;
        } catch (err) {
            toast.error("Failed to remove nurse");
            return null;
        }
    };


    return {
        loading,
        getPendingDoctors,
        getPendingNurses,
        approveDoctor,
        rejectDoctor,
        approveNurse,
        rejectNurse,
        getApprovedNurses ,
        getApprovedDoctors,
        removeNurse,
        removeDoctor
    };
};
