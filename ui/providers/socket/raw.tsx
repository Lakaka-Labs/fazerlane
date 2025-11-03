import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getWebSocketManager } from "@/config/instance";
import { WS_BASE_URL } from "@/config/routes";

type ProgressMap = Record<string, any>;

type WebSocketContextType = {
  progress: ProgressMap;
  send: (laneId: string, data: any) => void;
};

const WebSocketContext = createContext<WebSocketContextType>({
  progress: {},
  send: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{
  laneId: string[] | null;
  children: React.ReactNode;
}> = ({ laneId, children }) => {
  const [progress, setProgress] = useState<ProgressMap>({});
  const managersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!laneId || laneId.length === 0) return;

    // Create managers for all lanes
    laneId.forEach((id) => {
      if (managersRef.current[id]) return; // already exists

      const manager = getWebSocketManager(
        `${WS_BASE_URL}/progress/${id}`,
        (data: any) => {
          setProgress((prev) => ({
            ...prev,
            [id]: data,
          }));
        }
      );

      managersRef.current[id] = manager;
    });

    // Cleanup unused sockets when laneId list changes
    return () => {
      const activeLaneSet = new Set(laneId);
      for (const id in managersRef.current) {
        if (!activeLaneSet.has(id)) {
          managersRef.current[id].onMessageCallback = undefined;
          delete managersRef.current[id];
        }
      }
    };
  }, [laneId]);

  // Send to specific lane
  const send = (laneId: string, data: any) => {
    const manager = managersRef.current[laneId];
    if (!manager) {
      console.warn(`No WebSocket manager for laneId: ${laneId}`);
      return;
    }
    manager.send(data);
  };

  return (
    <WebSocketContext.Provider value={{ progress, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};
