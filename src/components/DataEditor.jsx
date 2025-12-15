export default function DataEditor({ reportData, setReportData }) {

  const handleInput = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

 const handleCSV = (e) => {
  const text = e.target.value.trim();

  const rows = [];
  let current = "";
  let insideQuotes = false;

  for (let char of text) {
    if (char === '"') insideQuotes = !insideQuotes;
    if (char === "\n" && !insideQuotes) {
      rows.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current) rows.push(current);

  const dataRows = rows.slice(1);

  const parsed = dataRows.map(row => {
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

    return {
      section: cols[0],
      date: cols[1],
      title: cols[2],
      meta: cols[3],
      summary: cols[4]?.replace(/^"|"$/g, ""),
      source: cols[5]?.replace(/^"|"$/g, ""),
    };
  });

  setReportData({ ...reportData, rows: parsed });
};


  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold text-gray-700 mb-3">Report Editor</h2>

      <label className="block font-semibold">Title</label>
      <input className="w-full border rounded-md p-2 mb-3" 
        name="title" value={reportData.title} onChange={handleInput} />

      <label className="block font-semibold">Period</label>
      <input className="w-full border rounded-md p-2 mb-3"
        name="period" value={reportData.period} onChange={handleInput} />

      <label className="block font-semibold">Compiled By</label>
      <input className="w-full border rounded-md p-2 mb-3"
        name="compiled" value={reportData.compiled} onChange={handleInput} />

      <label className="block font-semibold">CSV Data (Paste below):</label>
      <textarea 
        className="w-full border rounded-md p-2 h-40" 
        placeholder="Section,Date,Title,Category,Summary,Source"
        onChange={handleCSV}
      />
    </div>
  );
}
