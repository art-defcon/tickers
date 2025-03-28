import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import './App.css';

function App() {
  const [stockData, setStockData] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('TSLA');
  const [loading, setLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    // Fetch available stock symbols
    fetch('/api/symbols')
      .then(response => response.json())
      .then(data => setSymbols(data))
      .catch(error => console.error('Error fetching symbols:', error));
  }, []);

  useEffect(() => {
    setLoading(true);
    // Fetch stock data for selected symbol
    fetch(`/api/stocks?symbol=${selectedSymbol}`)
      .then(response => response.json())
      .then(data => {
        setStockData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching ${selectedSymbol} stock data:`, error);
        setLoading(false);
      });
  }, [selectedSymbol]);

  const formatCandlestickData = (data) => {
    if (!data || !data["Time Series (5min)"]) return { times: [], values: [] };
    
    const timeSeries = data["Time Series (5min)"];
    const times = [];
    const values = [];
    
    Object.keys(timeSeries)
      .sort((a, b) => new Date(a) - new Date(b)) // Sort by time
      .forEach(time => {
        const timePoint = timeSeries[time];
        times.push(time);
        // Format: [open, close, lowest, highest]
        values.push([
          parseFloat(timePoint["1. open"]),
          parseFloat(timePoint["4. close"]),
          parseFloat(timePoint["3. low"]),
          parseFloat(timePoint["2. high"]),
        ]);
      });
      
    return { times, values };
  };

  const getChartOptions = () => {
    if (!stockData) return {};
    
    const { times, values } = formatCandlestickData(stockData);
    
    return {
      title: {
        text: `${selectedSymbol} Stock Price`,
        left: 'center',
        textStyle: {
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#999',
            width: 1
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: (params) => {
          const item = params[0];
          if (item) {
            const date = new Date(item.name).toLocaleString();
            const [open, close, low, high] = item.data;
            const color = close >= open ? 'var(--up-color)' : 'var(--down-color)';
            return `
              <div style="font-weight: bold">${date}</div>
              <div style="color: ${color}; margin-top: 5px;">
                Open: $${open.toFixed(2)}<br/>
                Close: $${close.toFixed(2)}<br/>
                Low: $${low.toFixed(2)}<br/>
                High: $${high.toFixed(2)}
              </div>
            `;
          }
          return '';
        }
      },
      xAxis: {
        data: times,
        axisLine: {
          lineStyle: {
            color: '#666'
          }
        },
        axisLabel: {
          color: '#333',
          formatter: (value) => {
            return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        scale: true,
        splitLine: {
          lineStyle: {
            color: '#e9e9e9'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#666'
          }
        },
        axisLabel: {
          color: '#333',
          formatter: (value) => {
            return '$' + value.toFixed(2);
          }
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '10%'
      },
      dataZoom: [
        {
          type: 'inside',
          start: 50,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          bottom: '5%',
          height: 20,
          borderColor: '#e0e0e0',
          fillerColor: 'rgba(232, 232, 232, 0.6)',
          textStyle: {
            color: '#333'
          },
          handleStyle: {
            color: '#008acd',
            borderColor: '#8fb0f7'
          },
          start: 50,
          end: 100
        }
      ],
      series: [
        {
          type: 'candlestick',
          data: values,
          itemStyle: {
            color: '#c12e34',
            color0: '#0098d9',
            borderColor: '#c12e34',
            borderColor0: '#0098d9'
          }
        }
      ],
      backgroundColor: 'transparent'
    };
  };

  const handleSymbolChange = (event) => {
    setSelectedSymbol(event.target.value);
  };

  return (
    <div className="App">
      <h1>S&P 500 Stock Viewer</h1>
      
      <div className="controls">
        <label htmlFor="symbol-select">Select Stock Symbol: </label>
        <select 
          id="symbol-select" 
          value={selectedSymbol} 
          onChange={handleSymbolChange}
        >
          {symbols.map(symbol => (
            <option key={symbol} value={symbol}>{symbol}</option>
          ))}
        </select>
      </div>
      
      <div className="symbol-info">
        {stockData && stockData["Meta Data"] && (
          <p>{selectedSymbol} last refreshed: {stockData["Meta Data"]["3. Last Refreshed"]}</p>
        )}
      </div>

      {loading ? (
        <p className="loading-message">Loading stock data...</p>
      ) : stockData && stockData["Time Series (5min)"] ? (
        <div className="chart-container">
          <ReactECharts 
            option={getChartOptions()} 
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
            onEvents={{
              finished: () => setChartError(null),
              renderFailed: () => setChartError("Chart rendering failed. Please try a different stock.")
            }}
          />
          {chartError && <div className="chart-error">{chartError}</div>}
        </div>
      ) : (
        <p>No data available for {selectedSymbol}</p>
      )}
    </div>
  );
}

export default App;
