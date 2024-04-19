// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import "jest-canvas-mock";

global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    // Optionally simulate a resize event with initial dimensions
    this.callback([{ contentRect: { width: 100, height: 100 } }], this);
  }
  unobserve() {
    // Stop observing
  }
  disconnect() {
    // Clean up
  }
};

// Mock should be outside and before imports that need mocking if you're not using manual hoisting
jest.mock("./app/components/gaugeCharts", () => ({
  ...jest.requireActual("./app/components/gaugeCharts"),
  GaugeChart: jest.fn(() => null),
}));
