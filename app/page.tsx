"use client";

import { useState } from "react";
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
import Dropdown from "./components/dropdown";
import { MemoryChart } from "./components/gaugeChats";
import { getChartData } from "./utils/getChartData";
import useWebSocket from "./hooks/useWebSocket";
import { MACHINES } from "./constants";

import styles from "./page.module.css";

function WebSocketComponent() {
  const [server, setServer] = useState<string>(MACHINES[0]);
  const { messages, sendMessage } = useWebSocket(server);

  const matches = server.match(/\d+/);
  return (
    <>
      <CssBaseline />
      <Dropdown
        className={styles.dropdown}
        options={MACHINES.map((m) => ({ label: m, value: m }))}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setServer(e.target.value)
        }
        value={{ label: server, value: server }}
        name="Server"
      />
      <Grid container spacing={3} className={styles.chartContainer}>
        <Grid item xs={12} sm={6}>
          <Link href={`/server/${matches ? matches[0] : "01"}`}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h4">{server}</Typography>

              <Line
                options={{
                  responsive: true,
                  scales: { y: { beginAtZero: true } },
                }}
                data={getChartData(messages[server])}
              />
            </Paper>
          </Link>
        </Grid>
        <MemoryChart
          used={
            messages[server]?.data[messages[server]?.data.length - 1]?.memory
              ?.usedPercentage
          }
          free={
            messages[server]?.data[messages[server]?.data.length - 1]?.memory
              ?.freePercentage
          }
        />
      </Grid>
    </>
  );
}

export default WebSocketComponent;
