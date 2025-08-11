import { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// Sheetbest endpoint for both read & write
const API_URL = "https://api.sheetbest.com/sheets/9b1d9cfc-cf54-483a-a7d5-4bb7663a65e4";

export function DataProvider({ children }) {
  const [data, setData] = useState({});

  // Fetch data from Google Sheet
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
          ].map((n) => parseInt(n) || 0);
        });
        setData(structured);
      });
  }, []);

  // Helper to shape payload to match Google Sheet headers exactly
  const toRow = (clientName, month, persona, counts) => ({
    "Client Name": clientName,
    "Month": month,
    "Persona": persona,
    "Outreach": counts[0] ?? 0,
    "Connections": counts
