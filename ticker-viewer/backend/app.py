from flask import Flask, jsonify, request
from main import fetch_stock_data, get_sp500_symbols

app = Flask(__name__)

@app.route('/api/stocks', methods=['GET'])
def get_stock_data():
    symbol = request.args.get('symbol', 'TSLA')
    data = fetch_stock_data(symbol)
    return jsonify(data)

@app.route('/api/symbols', methods=['GET'])
def get_symbols():
    return jsonify(get_sp500_symbols())

# Keep the old endpoint for backward compatibility
@app.route('/api/tsla', methods=['GET'])
def get_tsla_stock():
    data = fetch_stock_data('TSLA')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
