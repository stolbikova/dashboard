"use client";
import { useEffect, useState, useRef } from "react";
import { WS_API, MAX_MESSAGES, MACHINES } from "./constants";
import { CssBaseline, Grid, Paper, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type MessageI = { index: number; data: WSResponse[] };
type WSRequest = {
  type: "memory" | "cpu" | "all";
  machine: string;
  subscribe: boolean;
};
type WSResponse = {
  machine: string;
  timestamp: number;
  memory: {
    total: number;
    free: number;
    used: number;
    usedPercentage: number;
    freePercentage: number;
  };
  cpu: {
    id: number;
    usage: number;
  }[];
};

const getChartData = (serverData: MessageI) => {
  const labels = serverData.data.map((item) =>
    new Date(item.timestamp).toLocaleTimeString()
  );
  const datasets = [
    {
      label: "Memory Used (%)",
      data: serverData.data.map((item) =>
        item.memory ? item.memory.usedPercentage : null
      ),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "CPU Usage (%) - CPU 0",
      data: serverData.data.map((item) =>
        item.cpu && item.cpu.length > 0 ? item.cpu[0].usage : null
      ),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    // Ensure to check CPU array existence and length before accessing it
  ];
  return { labels, datasets };
};

function WebSocketComponent() {
  const [messages, setMessages] = useState<Record<string, MessageI>>({});
  const websocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection.
    websocket.current = new WebSocket(WS_API);
    websocket.current.onopen = () => {
      console.debug("WebSocket is open now.");
      // Subscribing to machines should be done here after the connection is open
      MACHINES.forEach((m) => {
        sendMessage({ type: "all", machine: m, subscribe: true });
      });
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
    return () => {
      websocket.current?.close();
    };
  }, []);

  const addMessage = (newMessage: WSResponse) => {
    setMessages((prevMessages) => {
      const prev = prevMessages[newMessage.machine] || { index: 0, data: [] };
      let newData = [...prev.data];
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

  const goToDetailView = () => {};

  console.log(messages);
  return (
    <>
      <CssBaseline />
      <Grid container spacing={3}>
        {Object.keys(messages).map((key) => {
          const matches = key.match(/\d+/);
          return (
            <Grid item xs={12} sm={6} key={key} onClick={goToDetailView}>
              <Link href={`/server/${matches ? matches[0] : "01"}`}>
                <Paper style={{ padding: 16 }}>
                  <Typography variant="h4">{key}</Typography>

                  <Line
                    options={{
                      responsive: true,
                      scales: { y: { beginAtZero: true } },
                    }}
                    data={getChartData(messages[key])}
                  />
                </Paper>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

export default WebSocketComponent;
