"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { Line } from "react-chartjs-2";
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
import { getChartData } from "../../utils/getChartData";
import useWebSocket from "../../hooks/useWebSocket";
import { MessageType } from "../../types";

import styles from "./page.module.css";

type Params = {
  params: {
    slug: string;
  };
};

export default function Page({ params }: Params) {
  const [state, setState] = useState<{
    type: MessageType;
    cpuId: string;
    memoryType: "used" | "free";
  }>({
    type: "all",
    cpuId: "0",
    memoryType: "used",
  });
  const { messages } = useWebSocket(`server${params.slug}`, state.type);
  const server = `server${params.slug}`;
  const cpuLength =
    messages[server]?.data[messages[server]?.data.length - 1]?.cpu?.length;

  const chartData = useMemo(
    () =>
      getChartData(messages[server], state.type, state.cpuId, state.memoryType),
    [messages, server, state]
  );

  if (!messages[`server${params.slug}`]) {
    return null;
  }

  const handleChange =
    (type: "type" | "memoryType" | "cpuId") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value)
        setState((prev) => ({
          ...prev,
          [type]: e.target.value as MessageType,
        }));
    };

  return (
    <>
      <Paper className={styles.paper}>
        <Typography variant="h4" className={styles.header} component="h1">
          {server}
        </Typography>

        <FormControl>
          <RadioGroup
            defaultValue="all"
            name="radio-buttons-group"
            onChange={handleChange("type")}
          >
            <Grid>
              <FormControlLabel value="cpu" control={<Radio />} label="CPU" />

              {state.type !== "memory" && cpuLength ? (
                <FormControl>
                  {/* <FormLabel>CPU Id</FormLabel> */}
                  <RadioGroup
                    className={styles.radioGroup}
                    defaultValue="0"
                    name="radio-buttons-group"
                    onChange={handleChange("cpuId")}
                    row
                  >
                    {new Array(cpuLength).fill(1).map((cpuItem, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={idx}
                        control={<Radio />}
                        label={idx}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : null}
            </Grid>
            <Grid>
              <FormControlLabel
                value="memory"
                control={<Radio />}
                label="Memory"
              />

              {state.type !== "cpu" ? (
                <FormControl>
                  <RadioGroup
                    className={styles.radioGroup}
                    defaultValue="used"
                    name="radio-buttons-group"
                    onChange={handleChange("memoryType")}
                    row
                  >
                    <FormControlLabel
                      key={"0"}
                      value={"used"}
                      control={<Radio />}
                      label={"Used"}
                    />
                    <FormControlLabel
                      key={"1"}
                      value={"free"}
                      control={<Radio />}
                      label={"Free"}
                    />
                  </RadioGroup>
                </FormControl>
              ) : null}
            </Grid>
            <FormControlLabel value="all" control={<Radio />} label="All" />
          </RadioGroup>
        </FormControl>

        <Line
          options={{
            responsive: true,
            scales: { y: { beginAtZero: true } },
          }}
          data={chartData}
        />
      </Paper>
      <Link className={styles.link} href={`/`}>
        Go to main screen
      </Link>
    </>
  );
}
