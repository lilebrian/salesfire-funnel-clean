import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// Sheetbest endpoint for both read & write
const API_URL = "https://api.sheetbest.com/sheets/9b1d9cfc-cf54-483a-a7d5-4bb7663a65e4";

export function DataProvider({ children }) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(API_URL)
      .then(function (res) { return res.json(); })
      .then(function (rows) {
        var structured = {};
        rows.forEach(function (row) {
          var key = (row["Client Name"] || "") + "_" + (row["Month"] || "") + "_" + (row["Persona"] || "");
          structured[key] = [
            row["Outreach"],
            row["Connections"],
            row["Replies"],
            row["Meetings"],
            row["Proposals"],
            row["Contracts"]
          ].map(function (n) { return parseInt(n, 10) || 0; });
        });
        setData(structured);
      })
      .catch(function (e) {
        console.error("Read error:", e);
      });
  }, []);

  async function updateData(clientName, month, persona, counts) {
    var key = clientName + "_" + month + "_" + persona;
    var newData = Object.assign({}, data, { [key]: counts });
    setData(newData);

    try {
      var row = [{
        "Client Name": clientName,
        "Month": month,
        "Persona": persona,
        "Outreach": counts && counts[0] != null ? counts[0] : 0,
        "Connections": counts && counts[1] != null ? counts[1] : 0,
        "Replies": counts && counts[2] != null ? counts[2] : 0,
        "Meetings": counts && counts[3] != null ? counts[3] : 0,
        "Proposals": counts && counts[4] != null ? counts[4] : 0,
        "Contracts": counts && counts[5] != null ? counts[5] : 0
      }];

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Sheetbest write failed:", res.status, text);
      } else {
        // Optional: inspect echo
        await res.json().catch(function () { return null; });
      }
    } catch (e) {
      console.error("Write error:", e);
    }
  }

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
}

