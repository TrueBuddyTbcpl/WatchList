import { useState } from "react";
import axios from "axios";
import "./preview.css";

export default function ReportPreview({ reportData }) {
    const [showEmailModal, setShowEmailModal] = useState(false);

    const sendEmail = async () => {
        const email = document.getElementById("recipientEmail").value;

        if (!email) {
            alert("Please enter recipient email.");
            return;
        }

        try {
            await axios.post(
                "https://report-mailer-backend.onrender.com/send-report",
                {
                    ...reportData,
                    sendTo: email
                }
            );

            alert("Report emailed successfully!");
            setShowEmailModal(false);
        } catch (error) {
            console.error(error);
            alert("Failed to send email.");
        }
    };

    const renderSection = (title, items, numbered = false) => (


        <section className="bg-white border rounded-lg p-4">
            <h2 className="text-center text-sm font-extrabold text-white
        bg-gradient-to-r from-cyan-700 to-blue-500 px-3 py-1 rounded-md shadow mb-3">
                {title}
            </h2>

            {items.length === 0 && (
                <p className="text-xs text-gray-400 text-center">
                    No data available
                </p>
            )}

            {numbered ? (
                <ol className="list-decimal ml-5 space-y-3 text-sm text-gray-800">
                    {items.flatMap((item, i) =>
                        item.summary
                            .split("\n")
                            .map(line => line.trim())
                            .filter(Boolean)
                            .map((point, idx) => (
                                <li key={`${i}-${idx}`}>
                                    {point}
                                </li>
                            ))
                    )}
                </ol>
            ) : (

                items.map((item, i) => (
                    <div key={i} className="border-b py-2">
                        <span className="text-xs text-gray-500">{item.date}</span>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-gray-600">{item.meta}</p>
                        <p className="text-sm whitespace-pre-line">
                            {item.summary}
                        </p>

                        {item.source && (
                            <a
                                href={item.source}
                                target="_blank"
                                className="text-cyan-700 text-xs"
                            >
                                Source
                            </a>
                        )}
                    </div>
                ))
            )}

        </section>
    );

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
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {renderSection("INDIA", reportData.india)}
                {renderSection("INTERNATIONAL", reportData.international)}
                {renderSection("ANALYSIS", reportData.analysis, true)}
                {renderSection("RECOMMENDATION", reportData.recommendation, true)}
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

            {/* EMAIL MODAL */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow w-96">
                        <h2 className="text-xl font-bold mb-4">
                            Send Report via Email
                        </h2>

                        <input
                            id="recipientEmail"
                            type="email"
                            placeholder="Recipient email"
                            className="w-full border rounded-md p-2 mb-4"
                        />

                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                            onClick={sendEmail}
                        >
                            Send
                        </button>

                        <button
                            className="bg-gray-400 text-white px-3 py-2 rounded"
                            onClick={() => setShowEmailModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
