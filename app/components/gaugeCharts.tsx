import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Typography } from "@mui/material";

import styles from "./gaugeCharts.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export function GaugeChart(props: {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    cutout: string;
  }[];
}) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Doughnut data={props} options={options} />
    </div>
  );
}

export function MemoryChart({ used, free }: { used: number; free: number }) {
  return (
    <>
      <Typography variant="p">Memory usage</Typography>
      <GaugeChart
        labels={["Used", "Free"]}
        datasets={[
          {
            data: [used, free],
            backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(211,211,211)"],
            cutout: "0%",
          },
        ]}
      />
    </>
  );
}
