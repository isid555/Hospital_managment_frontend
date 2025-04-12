// components/PrescriptionViewModal.jsx
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PrescriptionViewModal({ prescriptions = [], onClose }) {
    const printRef = useRef();

    const downloadPDF = async () => {
        const element = printRef.current;

        // Use a high resolution scale for better clarity
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true, // if you have external images/fonts
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add more pages if needed
        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save("prescriptions.pdf");
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
                {/* Printable Area */}
                <div ref={printRef} className="max-h-none overflow-visible">

                    <h3 style={{color: "#1D4ED8"}} className="text-xl font-bold mb-4">
                        Prescriptions
                    </h3>

                    {prescriptions.length === 0 ? (
                        <p>No prescriptions found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {prescriptions.map((p) => (
                                <li
                                    key={p._id}
                                    style={{backgroundColor: "#F9FAFB"}}
                                    className="border rounded p-3 shadow"
                                >
                                    <p><strong>Medication:</strong> {p.medication}</p>
                                    <p><strong>Dosage:</strong> {p.dosage}</p>
                                    <p><strong>Frequency:</strong> {p.frequency}</p>
                                    <p><strong>Start:</strong> {new Date(p.startDate).toLocaleDateString()}</p>
                                    <p><strong>End:</strong> {new Date(p.endDate).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={downloadPDF}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Download as PDF
                    </button>
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
