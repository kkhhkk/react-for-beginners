const BASE_URL = "https://api.coinpaprika.com/v1";

export async function fetchCoins() {
  return await (await fetch(`${BASE_URL}/coins`)).json();
}

export async function fetchCoinInfo(coinId: string) {
  return await (await fetch(`${BASE_URL}/coins/${coinId}`)).json();
}

export async function fetchCoinTickers(coinId: string) {
  return await (await fetch(`${BASE_URL}/tickers/${coinId}`)).json();
}

export async function fetchCoinHistorical(coinId: string) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 7 * 52;
  return await (
    await fetch(
      `${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
    )
  ).json();
}

export async function fetchCoinPrice(coinId: string) {
  return await (await fetch(`${BASE_URL}/tickers/${coinId}/historical`)).json();
}

export async function fetchChartHistorical(coinId: string, setDate: string) {
  const endDate = Math.floor(Date.now() / 1000);
  function CalsetDate(setDate: string) {
    if (setDate === "1y") {
      return 365;
    } else if (setDate === "3m") {
      return 93;
    } else if (setDate === "1m") {
      return 31;
    } else if (setDate === "14d") {
      return 14;
    } else {
      return 7;
    }
  }
  const startDate = endDate - 60 * 60 * 24 * CalsetDate(setDate);
  return await (
    await fetch(
      `${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
    )
  ).json();
}
