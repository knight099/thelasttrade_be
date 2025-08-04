import requests

def get_nse_stock_price(symbol):
    url = f"https://www.nseindia.com/api/quote-equity?symbol={symbol.upper()}"
    headers = {
        "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) "
                       "Chrome/92.0.4515.107 Safari/537.36"),
        "Referer": "https://www.nseindia.com/"
    }
    session = requests.Session()
    # Do an initial get to NSE home to get cookies
    session.get("https://www.nseindia.com", headers=headers)
    resp = session.get(url, headers=headers)
    data = resp.json()
    return data["priceInfo"]["lastPrice"]

# Usage
price = get_nse_stock_price("TCS")
print(f"TCS price: {price}")
