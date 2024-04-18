export type MessageI = { index: number; data: WSResponse[] };
export type WSRequest = {
  type: "memory" | "cpu" | "all";
  machine: string;
  subscribe: boolean;
};
export type WSResponse = {
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
export type MessageType = "memory" | "cpu" | "all";
