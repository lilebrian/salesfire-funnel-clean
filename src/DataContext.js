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
    "Outreach": count
