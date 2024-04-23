import { renderHook, act, waitFor } from "@testing-library/react";
import WS from "jest-websocket-mock";

import useWebSocket from "./useWebSocket";
import { WS_API } from "../constants";

interface WebSocketMock extends WebSocket {
  connected: Promise<void>;
  send(data: string): void;
}

describe("useWebSocket", () => {
  let server: WebSocketMock;

  beforeEach(async () => {
    server = new WS(WS_API) as unknown as WebSocketMock;
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
