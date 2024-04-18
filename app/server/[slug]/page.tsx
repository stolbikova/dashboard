"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TableRow,
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
  const { messages, sendMessage } = useWebSocket(
    `server${params.slug}`,
    state.type
  );
  const firstSampleElement = messages[`server${params.slug}`]?.data[0];

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

  console.log(firstSampleElement);
  return (
    <Paper style={{ padding: 16 }}>
      <Typography
        variant="h4"
        className={styles.header}
      >{`server${params.slug}`}</Typography>

      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="all"
          name="radio-buttons-group"
          onChange={handleChange("type")}
        >
          <TableRow>
            <FormControlLabel value="cpu" control={<Radio />} label="CPU" />

            {state.type !== "memory" && firstSampleElement?.cpu?.length ? (
              <FormControl>
                {/* <FormLabel>CPU Id</FormLabel> */}
                <RadioGroup
                  className={styles.radioGroup}
                  defaultValue="0"
                  name="radio-buttons-group"
                  onChange={handleChange("cpuId")}
                  row
                >
                  {firstSampleElement.cpu &&
                    firstSampleElement.cpu.map((cpuItem, idx) => (
                      <FormControlLabel
                        key={cpuItem.id}
                        value={cpuItem.id}
                        control={<Radio />}
                        label={idx}
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            ) : null}
          </TableRow>
          <TableRow>
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
          </TableRow>
          <FormControlLabel value="all" control={<Radio />} label="All" />
        </RadioGroup>
      </FormControl>

      <Line
        options={{
          responsive: true,
          scales: { y: { beginAtZero: true } },
        }}
        data={getChartData(
          messages[`server${params.slug}`],
          state.type,
          state.cpuId,
          state.memoryType
        )}
      />
    </Paper>
  );
}
