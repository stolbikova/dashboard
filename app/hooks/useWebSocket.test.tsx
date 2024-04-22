import { renderHook, act, waitFor } from "@testing-library/react";
import useWebSocket from "./useWebSocket";
import WS from "jest-websocket-mock";

describe("useWebSocket", () => {
  let server: typeof WS;

  beforeEach(async () => {
    server = new WS("wss://lps-monitoring.up.railway.app/realtime");
  });

  afterEach(() => {
    WS.clean();
  });

  it("should open a WebSocket connection and handle messages", async () => {
    const { result } = renderHook(() => useWebSocket(["machine1"], "all"));

    await server.connected; // Ensure the WebSocket connection is established

    // Wait for the message to be sent to the WebSocket server
    await waitFor(() => {
      expect(server).toHaveReceivedMessages([
        JSON.stringify({ type: "all", machine: "machine1", subscribe: true }),
      ]);
    });

    // Simulate receiving a message from the WebSocket server
    act(() => {
      server.send(
        JSON.stringify({
          machine: "machine1",
          data: "Test",
          timestamp: Date.now(),
        })
      );
    });

    // Wait for the hook to process the received message
    await waitFor(() => {
      expect(result.current.messages["machine1"]).toBeDefined();
      expect(result.current.messages["machine1"].data.length).toBeGreaterThan(
        0
      );
      expect(result.current.messages["machine1"].data[0].data).toEqual("Test");
    });
  });
});
