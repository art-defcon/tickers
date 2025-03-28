import unittest
from unittest.mock import patch
from app import app

class TestTSLAStockAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_get_tsla_stock_integration(self):
        response = self.app.get('/api/tsla')
        print(response.json)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Time Series (5min)", response.json)
        self.assertIn("Meta Data", response.json)

if __name__ == '__main__':
    unittest.main()
