// components/PrescriptionViewModal.jsx
export default function PrescriptionViewModal({ prescriptions=[], onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-blue-700 mb-4">Prescriptions</h3>

                {prescriptions.length === 0 ? (
                    <p>No prescriptions found.</p>
                ) : (
                    <ul className="space-y-4">
                        {prescriptions.map((p) => (
                            <li key={p._id} className="border rounded p-3 bg-gray-50 shadow">
                                <p><strong>Medication:</strong> {p.medication}</p>
                                <p><strong>Dosage:</strong> {p.dosage}</p>
                                <p><strong>Frequency:</strong> {p.frequency}</p>
                                <p><strong>Start:</strong> {new Date(p.startDate).toLocaleDateString()}</p>
                                <p><strong>End:</strong> {new Date(p.endDate).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
