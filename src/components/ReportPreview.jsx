import { useState } from "react";
import axios from "axios";
import "./preview.css";

export default function ReportPreview({ reportData, setReportData }) {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [downloading, setDownloading] = useState(false);

    // ===============================
    // HELPERS
    // ===============================
    const updateItem = (section, index, field, value) => {
        setReportData(prev => {
            const updated = [...prev[section]];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, [section]: updated };
        });
    };

    const deleteItem = (section, index) => {
        setReportData(prev => {
            const updated = [...prev[section]];
            updated.splice(index, 1);
            return { ...prev, [section]: updated };
        });
        setEditing(null);
    };

    // ===============================
    // SEND EMAIL (UNCHANGED)
    // ===============================
    const sendEmail = async () => {
        const email = document.getElementById("recipientEmail")?.value;
        if (!email) return alert("Please enter recipient email.");

        try {
            await axios.post(
                "https://report-mailer-backend.onrender.com/send-report",
                { ...reportData, sendTo: email }
            );
            alert("Report emailed successfully!");
            setShowEmailModal(false);
        } catch {
            alert("Failed to send email.");
        }
    };

    // ===============================
    // DOWNLOAD PDF (SERVER-SIDE)
    // ===============================
    const downloadPDF = async () => {
        try {
            setDownloading(true);

            const response = await axios.post(
                "https://report-mailer-backend.onrender.com/generate-pdf",
                reportData,
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], {
                type: "application/pdf",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "fraud-report.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            alert("Failed to generate PDF.");
        } finally {
            setDownloading(false);
        }
    };

    // ===============================
    // MULTI-LINE → NUMBERED LIST
    // ===============================
    const renderNumberedPoints = (text) => {
        if (!text) return null;
        return text
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .map((line, idx) => (
                <li key={idx} className="mb-1">
                    {line}
                </li>
            ));
    };

    // ===============================
    // SECTION RENDER
    // ===============================
    const renderSection = (sectionKey, title, items, numbered = false) => (
        <section className="bg-white border rounded-lg p-4">
            <h2 className="text-center text-sm font-extrabold text-white
                bg-gradient-to-r from-cyan-700 to-blue-500 px-3 py-1 rounded-md shadow mb-3">
                {title}
            </h2>

            {items.map((item, i) => {
                const isEditing =
                    editing &&
                    editing.section === sectionKey &&
                    editing.index === i;

                return (
                    <div key={i} className="border-b py-4">

                        {/* TITLE */}
                        {isEditing ? (
                            <input
                                className="w-full font-semibold text-base mb-2 border rounded px-2 py-1"
                                value={item.title}
                                onChange={e =>
                                    updateItem(sectionKey, i, "title", e.target.value)
                                }
                            />
                        ) : (
                            <div className="font-semibold text-base mb-2">
                                {item.title}
                            </div>
                        )}

                        {/* SUMMARY */}
                        {isEditing ? (
                            <textarea
                                className="w-full border rounded p-2 text-sm"
                                value={item.summary}
                                onChange={e =>
                                    updateItem(sectionKey, i, "summary", e.target.value)
                                }
                            />
                        ) : numbered ? (
                            <ol className="list-decimal ml-5 text-sm text-gray-800 leading-relaxed">
                                {renderNumberedPoints(item.summary)}
                            </ol>
                        ) : (
                            <p className="text-sm text-gray-800 leading-relaxed">
                                {item.summary}
                            </p>
                        )}

                        {/* SOURCE */}
                        {isEditing ? (
                            <input
                                type="text"
                                className="w-full border rounded px-2 py-1 text-xs mt-2"
                                placeholder="Enter source URL"
                                value={item.source || ""}
                                onChange={e =>
                                    updateItem(sectionKey, i, "source", e.target.value)
                                }
                            />
                        ) : (
                            item.source && (
                                <a
                                    href={item.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-700 text-xs block mt-2 break-all"
                                >
                                    Source
                                </a>
                            )
                        )}


                        {/* ACTIONS */}
                        <div className="mt-2 flex gap-3 text-xs print:hidden">
                            {isEditing ? (
                                <>
                                    <button
                                        className="text-green-700"
                                        onClick={() => setEditing(null)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="text-red-600"
                                        onClick={() => deleteItem(sectionKey, i)}
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="text-blue-600"
                                    onClick={() =>
                                        setEditing({ section: sectionKey, index: i })
                                    }
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </section>
    );

    // ===============================
    // RENDER
    // ===============================
    return (
        <div id="print-area" className="bg-white rounded-xl shadow overflow-hidden">

            {/* HEADER */}
            <header className="bg-gradient-to-r from-cyan-700 to-blue-500 p-6 text-white flex gap-6 items-center">
                <div className="tb-logo">
                    <div className="tb-logo-main">TRUE BUDDY</div>
                    <div className="tb-logo-sub">Consulting</div>
                </div>

                <div>
                    <h1 className="text-2xl font-bold uppercase">
                        {reportData.title}
                    </h1>
                    <p className="text-sm mt-1">
                        <strong>Period:</strong> {reportData.period}
                    </p>
                    <span className="inline-block mt-2 text-xs bg-white/25 px-2 py-1 rounded">
                        {reportData.compiled}
                    </span>
                </div>
            </header>

            {/* CONTENT */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {renderSection("india", "INDIA", reportData.india)}
                {renderSection("international", "INTERNATIONAL", reportData.international)}
                {renderSection("analysis", "TRUE BUDDY ANALYSIS", reportData.analysis, true)}
                {renderSection("recommendation", "RECOMMENDATION", reportData.recommendation, true)}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end p-4 gap-3 print:hidden">
                <button
                    className="bg-green-600 text-white px-3 py-2 rounded"
                    onClick={() => sendEmail()}
                >
                    Send Email
                </button>

                <button
                    className="bg-cyan-700 text-white px-3 py-2 rounded"
                    onClick={downloadPDF}
                    disabled={downloading}
                >
                    {downloading ? "Generating PDF..." : "Save as PDF"}
                </button>
            </div>
        </div>
    );
}
