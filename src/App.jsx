import { useState } from "react";
import ReportPreview from "./components/ReportPreview";
import DataEditor from "./components/DataEditor";

export default function App() {
  const [reportData, setReportData] = useState({
    title: "Fraud Watchlist",
    period: "18 Oct 2025 — 24 Oct 2025",
    categories: "IPR / Cyber / Employee / Vendor / Theft / Online Fraud",
    compiled: "True Buddy Consulting Pvt Ltd",
    rows: []
  });

  return (

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <h1 className="text-5xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-700 to-blue-500 text-transparent bg-clip-text drop-shadow-sm text-center mb-6">TBCPL Report Editor</h1>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-1">
            <DataEditor reportData={reportData} setReportData={setReportData} />
          </div>

          <div className="lg:col-span-2">
            <ReportPreview reportData={reportData} />
          </div>

        </div>
      </div>
  );
}
