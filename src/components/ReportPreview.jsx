import { useState } from "react";
import axios from "axios";
import "./preview.css";

export default function ReportPreview({ reportData, setReportData }) {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [editing, setEditing] = useState(null); // { section, index }

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
    // EMAIL
    // ===============================
    const sendEmail = async () => {
        const email = document.getElementById("recipientEmail").value;
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
        bg-gradient-to-r from-cyan-700 to-blue-500 px-3 py-1 rounded-md shadow mb-3">{title}</h2>

            {items.map((item, i) => {
                const isEditing =
                    editing &&
                    editing.section === sectionKey &&
                    editing.index === i;

                return (
                    <div key={i} className="border-b py-4">

                        {/* DATE */}
                        <div className="text-xs text-gray-500 mb-1">
                            {item.date}
                        </div>

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
                        {item.source && (
                            <a
                                href={item.source}
                                target="_blank"
                                className="text-cyan-700 text-xs block mt-2"
                            >
                                Source
                            </a>
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

                {/* ⭐ FIXED TRUE BUDDY LOGO (Perfectly aligned) */}
                <div className="relative inline-block">

                    {/* TRUE BUDDY FRAME */}
                    <div className="tb-logo">
                        <div className="tb-logo-main">
                            TRUE BUDDY
                        </div>
                        <div className="tb-logo-sub">
                            Consulting
                        </div>
                    </div>


                    {/* CONSULTING BOX EXACTLY BELOW */}
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 translate-y-1 bg-[#5bb8ff] px-4 py-1 rounded-sm shadow">
                        <span className="text-white text-[16px] font-semibold">
                            Consulting
                        </span>
                    </div>
                </div>

                {/* HEADER DETAILS */}
                <div className="flex flex-col justify-center">
                    <h1
                        className="text-2xl mt-1 mb-1 drop-shadow-md tracking-wide uppercase font-bold"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                        {reportData.title}
                    </h1>

                    <p className="text-sm text-blue-50 mt-1">
                        <span className="font-semibold">Period:</span> {reportData.period}
                    </p>

                    <div className="mt-2">
                        <span className="px-2 py-1 bg-white/25 text-white rounded-md text-xs font-semibold shadow-sm backdrop-blur-sm border border-white/20">
                            {reportData.compiled}
                        </span>
                    </div>
                </div>
            </header>

            {/* CONTENT */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                {renderSection("india", "INDIA", reportData.india)}
                {renderSection("international", "INTERNATIONAL", reportData.international)}
                {renderSection("analysis", "ANALYSIS", reportData.analysis, true)}
                {renderSection("recommendation", "RECOMMENDATION", reportData.recommendation, true)}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end p-4 gap-3 print:hidden">
                <button
                    className="bg-green-600 text-white px-3 py-2 rounded"
                    onClick={() => setShowEmailModal(true)}
                >
                    Send Email
                </button>
                <button
                    className="bg-cyan-700 text-white px-3 py-2 rounded"
                    onClick={() => window.print()}
                >
                    Print / Save as PDF
                </button>
            </div>

            {/* FOOTER */}
            <footer className="bg-gradient-to-r from-cyan-700 to-blue-500 text-white px-4 py-3 text-xs">

                {/* Disclaimer */}
                <div className="mb-2 text-center leading-snug opacity-90" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                    Disclaimer – This document is based on publicly available information and field-level inputs compiled for general awareness and risk-intelligence purposes only.
                    It does not constitute legal advice, investigative findings, or a determination of liability.
                    Readers are advised to conduct independent verification and seek appropriate professional counsel
                    before taking any action based on this information.
                </div>
                {/* Footer Meta */}
                <div className="flex justify-between items-center border-t border-white/30 pt-2">
                    <div>
                        Prepared by <strong>True Buddy Consulting Pvt Ltd</strong> · Period: {reportData.period}
                    </div>
                    <div>
                        Contact: contact@tbcpl.co.in
                    </div>
                </div>

            </footer>
        </div>
    );
}
