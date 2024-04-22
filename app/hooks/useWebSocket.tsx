import { useEffect, useRef, useState } from "react";
import { WS_API, MAX_MESSAGES, MACHINES } from "../constants";
import { MessageI, WSRequest, WSResponse, MessageType } from "../types";

const useWebSocket = (
  machines: string[] | string = MACHINES,
  type: MessageType = "all"
) => {
  const [messages, setMessages] = useState<Record<string, MessageI>>({});
  const [isConnected, setIsConnected] = useState(false);
  const websocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection.
    websocket.current = new WebSocket(WS_API);
    websocket.current.onopen = () => {
      console.debug("WebSocket is open now.");
      setIsConnected(true);

      // Subscribe to machines after the connection is open
      if (Array.isArray(machines))
        machines.forEach((m) => {
          sendMessage({ type: type, machine: m, subscribe: true });
        });
      else sendMessage({ type: type, machine: machines, subscribe: true });
    };

    websocket.current.onmessage = (event) => {
      addMessage(JSON.parse(event.data));
    };

    websocket.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    websocket.current.onclose = () => {
      console.debug("WebSocket is closed now.");
      setIsConnected(false);
    };

    // Cleanup on component unmount or WebSocket close
    return () => {
      websocket.current?.close();
    };
  }, [machines]);

  const addMessage = (newMessage: WSResponse) => {
    setMessages((prevMessages) => {
      const machine = newMessage.machine;
      const machineData = prevMessages[machine] || { index: 0, data: [] };

      // Add new message to the data array
      let newData = [...machineData.data, newMessage];

      // Sort data by timestamp in ascending order
      newData.sort((a, b) => a.timestamp - b.timestamp);

      // Check if the data exceeds the maximum messages allowed
      if (newData.length > MAX_MESSAGES) {
        // Remove the oldest data if above max messages limit
        newData = newData.slice(-MAX_MESSAGES);
      }

      // Return the updated state
      return {
        ...prevMessages,
        [machine]: {
          ...machineData,
          data: newData,
        },
      };
    });
  };

  const sendMessage = (message: WSRequest) => {
    if (websocket.current?.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage, isConnected };
};

export default useWebSocket;
