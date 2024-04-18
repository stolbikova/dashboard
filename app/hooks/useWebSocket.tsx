import { useEffect, useRef, useState } from "react";
import { WS_API, MAX_MESSAGES, MACHINES } from "../constants";
import { MessageI, WSRequest, WSResponse, MessageType } from "../types";

const useWebSocket = (
  machines: string[] | string = MACHINES,
  type: MessageType = "all"
) => {
  const [messages, setMessages] = useState<Record<string, MessageI>>({});
  const websocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection.
    websocket.current = new WebSocket(WS_API);
    websocket.current.onopen = () => {
      console.debug("WebSocket is open now.");

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
    };

    // Cleanup on component unmount or WebSocket close
    return () => {
      websocket.current?.close();
    };
  }, [machines]);

  const addMessage = (newMessage: WSResponse) => {
    setMessages((prevMessages) => {
      const prev = prevMessages[newMessage.machine] || { index: 0, data: [] };
      const newData = [...prev.data];
      if (newData.length < MAX_MESSAGES) {
        newData.push(newMessage);
      } else {
        newData[prev.index] = newMessage;
      }
      const newIndex = (prev.index + 1) % MAX_MESSAGES;
      return {
        ...prevMessages,
        [newMessage.machine]: {
          index: newIndex,
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

  return { messages, sendMessage };
};

export default useWebSocket;
