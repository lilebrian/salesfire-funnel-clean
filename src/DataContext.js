import { createContext, useContext, useEffect, useState } from 'react';

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
          ].map(n => parseInt(n) || 0);
        });
        setData(structured);
      });
  }, []);

  const updateData = async (clientName, month, persona, counts) => {
    const key = `${clientName}_${month}_${persona}`;
    const newData = { ...data, [key]: counts };
    setData(newData);

    // Push to Google Sheet
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        clientName,
        month,
        persona,
        counts
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
}
