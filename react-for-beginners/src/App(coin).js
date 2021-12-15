import { useState, useEffect } from "react";

function AppCoin() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [selectOpt, setSelectOpt] = useState("name");
  const [value, setValue] = useState("");
  const [result, setResult] = useState([]);
  const [nowResult, setNowResult] = useState(false);
  const [afterResult, setAfterResult] = useState(false);
  const [pay, setPay] = useState(0);

  useEffect(
    () =>
      fetch("https://api.coinpaprika.com/v1/tickers")
        .then((response) => response.json())
        .then((json) => {
          setCoins(json);
          setLoading(false);
        }),
    []
  );

  const onChangeOpt = (event) => setSelectOpt(event.target.value);
  const onChangeIn = (event) => setValue(event.target.value);
  const onSubmit = (event) => {
    event.preventDefault();
    let isResult = false;
    if (selectOpt === "name") {
      coins.map((coin) => {
        if (coin.name.toUpperCase() === value.toUpperCase()) {
          isResult = true;
          setResult(coin);
          setNowResult(true);
          setAfterResult(false);
        }
      });
    } else if (selectOpt === "symbol") {
      coins.map((coin) => {
        if (coin.symbol.toUpperCase() === value.toUpperCase()) {
          isResult = true;
          setResult(coin);
          setNowResult(true);
          setAfterResult(false);
        }
      });
    }
    if (!isResult) {
      setAfterResult(true);
      setNowResult(false);
    }
    setValue("");
  };
  const payment = (event) => setPay(event.target.value);
  return (
    <div>
      <h1>The Coins! {loading ? "" : `(${coins.length})`}</h1>
      <form onSubmit={onSubmit}>
        <select onChange={onChangeOpt}>
          <option value="name">Name</option>
          <option value="symbol">Symbol</option>
        </select>
        <input
          value={value}
          onChange={onChangeIn}
          type="text"
          placeholder={selectOpt}
        />
        <input type="submit" value="Find Coin" />
      </form>

      {nowResult ? (
        <form>
          <h2>Caculate USD to {result.symbol}</h2>
          <input onChange={payment} type="number" placeholder="USD" />
          <h3>
            You can buy {pay / result.quotes.USD.price} {result.symbol}
          </h3>
        </form>
      ) : null}
      {afterResult ? (
        <form>
          <h2>Search Again. There is no coin information.</h2>
        </form>
      ) : null}

      {loading ? (
        <strong>Loading...</strong>
      ) : (
        <ul>
          {coins.map((coin) => (
            <li key={coin.id}>
              {coin.name} ({coin.symbol}) : ${coin.quotes.USD.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AppCoin;
