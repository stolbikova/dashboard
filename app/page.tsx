"use client";

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
import { getChartData } from "./utils/getChartData";
import useWebSocket from "./hooks/useWebSocket";

function WebSocketComponent() {
  const { messages, sendMessage } = useWebSocket();

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
