import './index.css';
import { useState } from 'react';
import FunnelVisualizer from './FunnelChart';

const months = [
  "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
  "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"
];

const personas = ["Operations", "Project Management", "HR/Talent Acquisition"];

const sampleData = [];

personas.forEach((persona) => {
  months.forEach((month) => {
    sampleData.push({
      month,
      persona,
      counts:
        month === "Jan 2025" || month === "Feb 2025" || month === "Mar 2025"
          ? generateSampleCounts(persona, month)
          : [0, 0, 0, 0, 0, 0],
    });
  });
});

function generateSampleCounts(persona, month) {
  const seed = {
    "Operations": { "Jan 2025": [500, 300, 180, 90, 45, 20], "Feb 2025": [550, 330, 198, 99, 50, 22], "Mar 2025": [450, 270, 160, 80, 40, 18] },
    "Project Management": { "Jan 2025": [400, 250, 140, 70, 35, 15], "Feb 2025": [440, 275, 154, 77, 39, 17], "Mar 2025": [360, 225, 126, 63, 31, 13] },
    "HR/Talent Acquisition": { "Jan 2025": [350, 200, 120, 60, 30, 12], "Feb 2025": [385, 220, 132, 66, 33, 13], "Mar 2025": [320, 185, 111, 55, 28, 10] },
  };
  return seed[persona][month] || [0, 0, 0, 0, 0, 0];
}

const stages = ["Outreach", "Connections", "Replies", "Meetings", "Proposals", "Contracts"];

function App() {
  const [selectedMonth, setSelectedMonth] = useState("Jan 2025");
  const [selectedPersona, setSelectedPersona] = useState("Operations");

  const filtered = sampleData.find(
    (d) => d.month === selectedMonth && d.persona === selectedPersona
  );

  const counts = filtered?.counts || [];

  const conversionRates = counts.map((count, i) => {
    if (i === 0) return "";
    return counts[i - 1] > 0
      ? ((count / counts[i - 1]) * 100).toFixed(1) + "%"
      : "0%";
  });

  const winRate =
    counts[0] > 0 ? ((counts[5] / counts[0]) * 100).toFixed(1) + "%" : "0%";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B111D", color: "white", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#0B111D", padding: "2rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <img src="/logo-dark.jpg.jpg" alt="SalesFire Consulting Logo" style={{ height: "100px" }} />
        </div>
        <h2 style={{ textAlign: "center", color: "#C44528", marginBottom: "2rem" }}>
          Sales Funnel Dashboard
        </h2>

        {/* Filter Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <label style={{ fontSize: "0.9rem", color: "#ccc" }}>Select Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: "0.5rem", backgroundColor: "#1D2739", color: "white", border: "1px solid #2A3548", borderRadius: "5px" }}
            >
              {months.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.9rem", color: "#ccc" }}>Select Persona</label>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              style={{ padding: "0.5rem", backgroundColor: "#1D2739", color: "white", border: "1px solid #2A3548", borderRadius: "5px" }}
            >
              {personas.map((persona) => (
                <option key={persona}>{persona}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Funnel Chart */}
        <FunnelVisualizer data={counts} stages={stages} />

        {/* Table Summary */}
        <table style={{ width: "100%", textAlign: "left", borderSpacing: "0 10px" }}>
          <thead>
            <tr style={{ color: "#ccc", fontSize: "0.9rem" }}>
              <th>Stage</th>
              <th>Count</th>
              <th>Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage, i) => (
              <tr key={stage} style={{ backgroundColor: "#1D2739", color: "white" }}>
                <td style={{ padding: "0.5rem", fontWeight: "bold" }}>{stage}</td>
                <td style={{ padding: "0.5rem" }}>{counts[i]}</td>
                <td style={{ padding: "0.5rem" }}>{conversionRates[i]}</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: "#202B3D", color: "white", fontWeight: "bold" }}>
              <td style={{ padding: "0.5rem" }}>Win Rate</td>
              <td style={{ padding: "0.5rem" }} colSpan="2">{winRate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

  

 
