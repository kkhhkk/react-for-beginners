import { Helmet } from "react-helmet";
import {
  Switch,
  Route,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 40px;
  display: flex;
  align-items: center;
`;

const Img = styled.img`
  width: 45px;
  height: 45px;
  margin-right: 10px;
`;

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
`;

const CoinInfoBlock = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const CoinInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;

  span:first-child {
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 5px;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Tab = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  width: 210px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 10px 0px;
  margin-bottom: 15px;
  font-weight: 400;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
    padding: 2.5px 80px;
  }
`;

const Back = styled.div`
  font-size: 30px;
  margin-top: 20px;
  margin-left: 20px;
`;

interface RouteParmas {
  coinId: string;
}

interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface TickersData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams<RouteParmas>();
  const { state } = useLocation<RouteState>();
  const chartMatch = useRouteMatch("/:coinId/chart");
  const priceMatch = useRouteMatch("/:coinId/price");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const {
    isLoading: tickersLoading,
    data: tickersData,
  } = useQuery<TickersData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 5000,
    }
  );
  //     const [loading, setLoading] = useState(true);
  //     const [info, setInfo] = useState<InfoData>();
  //     const [priceInfo, setPriceInfo] = useState<PriceData>();
  //   useEffect(() => {
  //     (async () => {
  //       const infoData = await (
  //         await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //       ).json();
  //       console.log(infoData);
  //       const priceData = await (
  //         await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //       ).json();
  //       console.log(priceData);
  //       setInfo(infoData);
  //       setPriceInfo(priceData);
  //       setLoading(false);
  //     })();
  //   }, [coinId]);

  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Back>
        <Link to="/">🏠</Link>
      </Back>
      <Header>
        <Title>
          <Img
            src={`https://cryptoicon-api.vercel.app/api/icon/${infoData?.symbol.toLowerCase()}`}
          />
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <>
          <CoinInfoBlock>
            <CoinInfo>
              <span>Rank</span>
              <span>{infoData?.rank}</span>
            </CoinInfo>
            <CoinInfo>
              <span>Symbol</span>
              <span>{infoData?.symbol}</span>
            </CoinInfo>
          </CoinInfoBlock>
          <CoinInfoBlock>
            <CoinInfo>
              <span>Max Price Date</span>
              <span>{tickersData?.quotes.USD.ath_date.slice(0, 10)}</span>
            </CoinInfo>
            <CoinInfo>
              <span>Max Price</span>
              <span>${tickersData?.quotes.USD.ath_price.toFixed(2)}</span>
            </CoinInfo>
            <CoinInfo>
              <span>Current Price</span>
              <span>${tickersData?.quotes.USD.price.toFixed(2)}</span>
            </CoinInfo>
          </CoinInfoBlock>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart/1y`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Switch>
            <Route path={`/:coinId/price`}>
              <Price coinId={coinId} />
            </Route>
          </Switch>
          <Switch>
            <Route path={`/:coinId/chart/`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
