import { useState } from "react";
import usePrescription from "../hooks/usePrescription";
import useDoctorAppointments from "../hooks/useDoctorAppointments";

export default function PrescriptionModal({ appointment, onClose }) {
    const [medications, setMedications] = useState([
        { medication: "", dosage: "", frequency: "" },
    ]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const doctorID = localStorage.getItem("id");
    const { createPrescription } = usePrescription();
    const { handleApprove } = useDoctorAppointments();

    const handleMedicationChange = (index, field, value) => {
        const updated = [...medications];
        updated[index][field] = value;
        setMedications(updated);
    };

    const addMedication = () => {
        setMedications([...medications, { medication: "", dosage: "", frequency: "" }]);
    };

    const removeMedication = (index) => {
        const updated = medications.filter((_, i) => i !== index);
        setMedications(updated);
    };

    const handleSubmit = async () => {
        if (!startDate || !endDate) {
            alert("Start and End date are required");
            return;
        }

        try {
            for (const med of medications) {
                await createPrescription({
                    user: appointment.user._id,
                    doctor: doctorID,
                    medication: med.medication,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    startDate,
                    endDate,
                });
            }

            await handleApprove(appointment._id);
            onClose();
        } catch (error) {
            console.error("Error creating prescription:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h3 className="text-xl font-bold text-blue-700 mb-4">Write Prescription</h3>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {medications.map((med, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Medication"
                                value={med.medication}
                                onChange={(e) => handleMedicationChange(index, "medication", e.target.value)}
                                className="w-1/3 p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Dosage"
                                value={med.dosage}
                                onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                                className="w-1/4 p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Frequency"
                                value={med.frequency}
                                onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                                className="w-1/4 p-2 border rounded"
                            />
                            {medications.length > 1 && (
                                <button onClick={() => removeMedication(index)} className="text-red-500 font-bold text-xl">×</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addMedication} className="text-blue-600 text-sm font-semibold hover:underline">
                        + Add Medication
                    </button>
                </div>

                <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Complete
                    </button>
                </div>
            </div>
        </div>
    );
}
