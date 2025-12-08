import React, { useState } from "react";
import axios from "axios";

const SendReport = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    idNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendReport = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("https://report-mailer-backend.onrender.com/send-report", form);

      setMessage("Email sent successfully!");
    } catch (error) {
      setMessage("Failed to send email.");
      console.error("Email error:", error);
    }

    setLoading(false);
  };

  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <h2>Send Fraud Report</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="text"
        name="idNumber"
        placeholder="ID Number"
        value={form.idNumber}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={sendReport} disabled={loading}>
        {loading ? "Sending..." : "Send Report"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default SendReport;
