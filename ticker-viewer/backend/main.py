import requests
import json
import random
import datetime
from config import API_KEY

def generate_mock_stock_data(symbol="TSLA"):
    """Generate mock stock data when the API fails or reaches rate limits"""
    now = datetime.datetime.now()
    base_price = {
        "AAPL": 185.0, "MSFT": 420.0, "AMZN": 180.0, "GOOGL": 150.0, "META": 475.0,
        "TSLA": 275.0, "NVDA": 920.0, "JPM": 200.0, "JNJ": 145.0, "V": 275.0,
        "PG": 160.0, "UNH": 490.0, "HD": 350.0, "BAC": 38.0, "XOM": 115.0,
        "PFE": 26.0, "CSCO": 48.0, "INTC": 42.0, "VZ": 40.0, "DIS": 112.0,
        "NFLX": 625.0, "ADBE": 490.0, "CRM": 275.0, "CMCSA": 42.0, "PEP": 170.0
    }.get(symbol, 100.0)  # Default to 100 if symbol not found
    
    # Mock data structure to match Alpha Vantage API response
    mock_data = {
        "Meta Data": {
            "1. Information": "Intraday (5min) open high low close prices and volume",
            "2. Symbol": symbol,
            "3. Last Refreshed": now.strftime("%Y-%m-%d %H:%M:%S"),
            "4. Interval": "5min",
            "5. Output Size": "Compact",
            "6. Time Zone": "US/Eastern"
        },
        "Time Series (5min)": {}
    }
    
    # Generate 100 data points at 5-minute intervals
    time_series = {}
    current_time = now
    
    # Start with the base price
    price = base_price
    
    for i in range(100):
        # Create some random price movements (more volatile for certain stocks)
        volatility = 0.01  # Default 1% volatility
        
        # Higher volatility for certain stocks
        if symbol in ["TSLA", "NVDA", "AMZN", "NFLX"]:
            volatility = 0.015
            
        # Calculate high/low range for this interval
        high_low_range = price * volatility * 2
        
        # Generate random price movement (-volatility to +volatility)
        change_percent = (random.random() * 2 - 1) * volatility
        
        # Calculate new prices
        open_price = price
        close_price = price * (1 + change_percent)
        high_price = max(open_price, close_price) + (random.random() * high_low_range / 2)
        low_price = min(open_price, close_price) - (random.random() * high_low_range / 2)
        
        # Generate a random volume between 100,000 and 2,000,000
        volume = int(random.random() * 1900000 + 100000)
        
        # Format time for this data point (stepping back 5 minutes each iteration)
        time_string = current_time.strftime("%Y-%m-%d %H:%M:%S")
        
        # Add to time series
        time_series[time_string] = {
            "1. open": f"{open_price:.4f}",
            "2. high": f"{high_price:.4f}",
            "3. low": f"{low_price:.4f}",
            "4. close": f"{close_price:.4f}",
            "5. volume": f"{volume}"
        }
        
        # Step back 5 minutes for next data point
        current_time = current_time - datetime.timedelta(minutes=5)
        
        # Update price for next iteration
        price = close_price
    
    mock_data["Time Series (5min)"] = time_series
    return mock_data

def fetch_stock_data(symbol="TSLA"):
    """Fetch stock data from Alpha Vantage API or fall back to mock data if API fails"""
    try:
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=5min&apikey={API_KEY}'
        response = requests.get(url)
        data = response.json()
        
        # Check if we got actual data or just an API limit message
        if "Time Series (5min)" not in data or len(data.get("Time Series (5min)", {})) == 0:
            print(f"API limit reached or no data available. Using mock data for {symbol}")
            return generate_mock_stock_data(symbol)
        
        return data
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return generate_mock_stock_data(symbol)

def get_sp500_symbols():
    # This would normally fetch the full S&P 500 list from an API
    # For simplicity, returning a sample of major S&P 500 stocks
    return [
        "AAPL", "MSFT", "AMZN", "GOOGL", "META", 
        "TSLA", "NVDA", "JPM", "JNJ", "V", 
        "PG", "UNH", "HD", "BAC", "XOM",
        "PFE", "CSCO", "INTC", "VZ", "DIS",
        "NFLX", "ADBE", "CRM", "CMCSA", "PEP"
    ]

if __name__ == "__main__":
    stock_data = fetch_stock_data("TSLA")
    print(stock_data)
