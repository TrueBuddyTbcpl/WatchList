export default function DataEditor({ reportData, setReportData }) {

  const handleInput = (e) => {
    setReportData({
      ...reportData,
      [e.target.name]: e.target.value
    });
  };

  // ===============================
  // ROBUST CSV PARSER
  // ===============================
  const parseCSV = (text) => {
    if (!text || !text.trim()) return [];

    const rows = [];
    let current = "";
    let insideQuotes = false;

    // Step 1: Split rows safely
    for (let char of text.trim()) {
      if (char === '"') insideQuotes = !insideQuotes;

      if (char === "\n" && !insideQuotes) {
        rows.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    if (current) rows.push(current);

    // Remove header row
    const dataRows = rows.slice(1);

    // Step 2: Parse columns safely
    return dataRows.map(row => {
      const cols = [];
      let value = "";
      insideQuotes = false;

      for (let char of row) {
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
          cols.push(value.trim());
          value = "";
        } else {
          value += char;
        }
      }
      cols.push(value.trim());

      /*
        Expected CSV:
        Date,Title,Category,Summary,Source

        Summary may contain commas → must re-join
      */
      return {
        date: cols[0] || "",
        title: cols[1] || "",
        category: cols[2] || "",
        summary: cols.slice(3, cols.length - 1)
          .join(",")
          .replace(/^"|"$/g, "")
          .trim(),
        source: cols[cols.length - 1]
          ?.replace(/^"|"$/g, "")
          .trim() || ""
      };
    });
  };

  const handleCSV = (sectionKey, text) => {
    const parsed = parseCSV(text);
    setReportData({
      ...reportData,
      [sectionKey]: parsed
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">

      <h2 className="text-lg font-bold text-gray-700">
        Report Editor
      </h2>

      {/* COMMON DETAILS */}
      <input
        className="w-full border rounded-md p-2"
        name="title"
        placeholder="Report Title"
        value={reportData.title}
        onChange={handleInput}
      />

      <input
        className="w-full border rounded-md p-2"
        name="period"
        placeholder="Period"
        value={reportData.period}
        onChange={handleInput}
      />

      <input
        className="w-full border rounded-md p-2"
        name="compiled"
        placeholder="Compiled By"
        value={reportData.compiled}
        onChange={handleInput}
      />

      {/* SECTION CSV INPUTS */}
      {[
        { key: "india", label: "INDIA" },
        { key: "international", label: "INTERNATIONAL" },
        { key: "analysis", label: "ANALYSIS" },
        { key: "recommendation", label: "RECOMMENDATION" }
      ].map(sec => (
        <div key={sec.key}>
          <label className="block font-semibold mb-1">
            {sec.label} CSV
          </label>

          <textarea
            className="w-full border rounded-md p-2 h-32 font-mono text-sm"
            placeholder="Date,Title,Category,Summary,Source"
            onChange={(e) => handleCSV(sec.key, e.target.value)}
          />
        </div>
      ))}

    </div>
  );
}
