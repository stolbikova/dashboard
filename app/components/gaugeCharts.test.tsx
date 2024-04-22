import { render, screen } from "@testing-library/react";

import { MemoryChart } from "./gaugeCharts";

describe("MemoryChart", () => {
  it("renders correctly with given props", () => {
    const { container } = render(<MemoryChart used={50} free={50} />);

    expect(container).toBeInTheDocument();

    expect(screen.getByText("Memory usage")).toBeInTheDocument();

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
