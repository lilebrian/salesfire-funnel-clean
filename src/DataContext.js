import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

const API_URL = "https://api.sheetbest.com/sheets/9b1d9cfc-cf54-483a-a7d5-4bb7663a65e4";

export function DataProvider({ children }) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((rows) => {
        const structured = {};
        rows.forEach((row) => {
          const key = `${row["Client Name"]}_${row["Month"]}_${row["Persona"]}`;
          structured[key] = [
            row["Outreach"],
            row["Connections"],
            row["Replies"],
            row["Meetings"],
            row["Proposals"],
            row["Contracts"]
          ].map((n) => parseInt(n, 10) || 0);
        });
        setData(structured);
      })
      .catch((e) => {
        console.error("Read error:", e);
      });
  }, []);

  const toRow = (clientName, month, persona, counts) => ({
    "Client Name": clientName,
    "Month": month,
    "Persona": persona,
    "Outreach": counts[0] ?? 0,
    "Connections": counts[1] ?? 0,
    "Replies": counts[2] ?? 0,
    "Meetings": counts[3] ?? 0,
    "Proposals": counts[4] ?? 0,
    "Contracts": counts[5] ?? 0
  });

  const updateData = async (clientName, month, persona, counts) => {
    const key = `${clientName}_${month}_${persona}`;
    const newData = { ...data, [key]: counts };
    setData(newData);

    try {
      const payload = [toRow(clientName, month, persona, counts)];
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Sheetbest write failed:", res.status, text);
      } else {
        // Optional: inspect the echo
        await res.json().catch(() => null);
      }
    } catch (e) {
      console.error("Write error:", e);
    }
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
}

