import requests

def get_bse_stock_price(bse_code):
    url = f"https://api.bseindia.com/BseIndiaAPI/api/GetStockReachGraphData/w?scripcode={bse_code}&flag=0"
    headers = {"User-Agent": "Mozilla/5.0"}
    r = requests.get(url, headers=headers)
    data = r.json()
    # The last item in 'DataGraph' contains latest price info
    last_price = float(data["DataGraph"][-1]["Value"])
    return last_price

# Usage
price = get_bse_stock_price("500325")
print(f"RELIANCE price (BSE): {price}")
