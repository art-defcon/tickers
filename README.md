# Stock Ticker Viewer

A streamlined application for monitoring stock prices with real-time updates and visualization.

![Stock Ticker Screenshot](https://github.com/art-defcon/tickers/blob/main/ticker-viewer/public/ticker-screenshot.png)

## Features

- Real-time stock price tracking
- Interactive price charts with time-based filtering
- Support for multiple market indices
- Clean, intuitive user interface

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation
Note: You need an account at https://www.alphavantage.co/ (is free at the moment of writing this)
put in ticker-viewer/backend/config.py:
API_KEY = "your key here" 

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```

## Technologies Used

- React.js frontend
- Python backend services
- WebSocket for real-time data streaming

## Libraries Used

- [ECharts](https://echarts.apache.org/)
- [ECharts for React](https://github.com/apache/echarts-for-react)
- [React](https://reactjs.org/)
- [React DOM](https://reactjs.org/docs/react-dom.html)
- [Create React App](https://create-react-app.dev/docs/getting-started/)
- [Recharts](https://recharts.org/en-US/)
