import { MessageI, MessageType } from "app/types";

export const getChartData = (
  serverData: MessageI,
  type: MessageType = "all",
  cpuId: string = "0",
  memoryType: "used" | "free" = "used"
) => {
  const labels = serverData?.data.map((item) =>
    new Date(item.timestamp || 0).toLocaleTimeString()
  );
  const datasets = [
    ...(type !== "cpu"
      ? [
          {
            label: `Memory ${memoryType} (%)`,
            data: serverData?.data.map((item) =>
              item.memory ? item.memory[`${memoryType}Percentage`] : null
            ),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ]
      : []),
    ...(type !== "memory"
      ? [
          {
            label: `CPU Usage (%) - CPU ${cpuId}`,
            data: serverData?.data.map((item) =>
              item.cpu && item.cpu[Number(cpuId)]
                ? item.cpu[Number(cpuId)].usage
                : null
            ),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ]
      : []),
  ];
  return { labels, datasets };
};
