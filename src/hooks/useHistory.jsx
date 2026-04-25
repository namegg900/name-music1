import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const HISTORY_STORAGE_KEY = "nameMusicHistory";
const HistoryContext = createContext(null);

export const HistoryProvider = ({ children }) => {
  const [historySongs, setHistorySongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      setHistorySongs(raw ? JSON.parse(raw) : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <HistoryContext.Provider value={{ historySongs, loading, fetchHistory, setHistorySongs }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
