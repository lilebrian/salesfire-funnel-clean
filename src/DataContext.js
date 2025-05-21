import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialData = {};

export function DataProvider({ children }) {
  const [data, setData] = useState(initialData);

  const updateData = (month, persona, newCounts) => {
    const key = `${month}_${persona}`;
    setData((prev) => ({
      ...prev,
      [key]: newCounts
    }));
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
}
