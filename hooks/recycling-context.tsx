import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ScanResult {
  item: string;
  category: string;
  recyclable: boolean;
  instructions: string;
  alternatives: string[];
  impact: string;
}

interface RecyclingStats {
  itemsScanned: number;
  co2Saved: number;
  streak: number;
  level: number;
}

export const [RecyclingProvider, useRecycling] = createContextHook(() => {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<RecyclingStats>({
    itemsScanned: 0,
    co2Saved: 0,
    streak: 1,
    level: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [historyData, statsData] = await Promise.all([
        AsyncStorage.getItem("scanHistory"),
        AsyncStorage.getItem("recyclingStats"),
      ]);

      if (historyData) {
        setScanHistory(JSON.parse(historyData));
      }
      if (statsData) {
        setStats(JSON.parse(statsData));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const addScanResult = useCallback(async (result: ScanResult) => {
    const updatedHistory = [result, ...scanHistory].slice(0, 50);
    setScanHistory(updatedHistory);

    const updatedStats = {
      ...stats,
      itemsScanned: stats.itemsScanned + 1,
      co2Saved: stats.co2Saved + (result.recyclable ? 0.5 : 0),
      level: Math.floor((stats.itemsScanned + 1) / 10) + 1,
    };
    setStats(updatedStats);

    try {
      await Promise.all([
        AsyncStorage.setItem("scanHistory", JSON.stringify(updatedHistory)),
        AsyncStorage.setItem("recyclingStats", JSON.stringify(updatedStats)),
      ]);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, [scanHistory, stats]);

  return useMemo(() => ({
    scanHistory,
    stats,
    addScanResult,
  }), [scanHistory, stats, addScanResult]);
});