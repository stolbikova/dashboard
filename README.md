# Seed Metrics Dashboard

A real-time dashboard which consume fake server metrics using websocket connection.

## Features

1.  Consume Real-Time Server Metrics
    As a user, I want to view real-time memory and CPU metrics from all five servers so that I can monitor their performance continuously.
2.  Responsive Dashboard Design (Bonus)
    As a user, I need the dashboard to be responsive to different screen sizes so that I can view the metrics clearly on any device.
3.  Metric Visualization
    As a user, I want to see each server's metrics displayed in time-series, and gauge charts so that I can easily understand the data at a glance.
4.  Individual Server View
    As a user, I want the option to view each server's metrics in a separate detailed view so that I can focus on a single server's performance when needed.
5.  Aggregate Server Metrics View (Bonus)
    As a user, I want to be able to view all servers' metrics in a single comprehensive view to get an overview of the overall system health.
6.  Server Selection
    As a user, I want to select a specific server from a list to view its metrics so that I can quickly navigate to the data I am interested in.
7.  Metric Toggling (Bonus)
    As a user, I want to toggle CPU or memory metrics on and off so that I can control which data is displayed according to my current needs.

## Install dependencies

```bash
npm install
```

## Run local server

```bash
npm dev
```

Server will be launched on http://localhost:3000/

## Running Tests

```bash
npm test
```

## Notes

1. I maintain a buffer of only 100 data samples in memory. When new data arrives and the buffer is full, I discard the oldest data samples to make room for the new ones.
2. I was unable to implement the aggregate server metrics view because, although the server acknowledges the request to send data for all five servers successfully, it only sends data for the first server. I've suggested that there is some error in server implementation.
