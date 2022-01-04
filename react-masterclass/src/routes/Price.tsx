import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinTickers } from "../api";

const Overview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceLists = styled.ul``;

const PriceList = styled.li`
  background-color: rgba(0, 0, 0, 0.5);
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
  width: 430px;
  font-size: 15px;
  border-radius: 20px;
  margin-bottom: 10px;
  padding: 15px;
`;

const Tag = styled.h3`
  width: 50%;
  font-size: 15px;
  font-weight: 900;
  span {
    font-size: 20px;
    color: white;
  }
`;

const Text = styled.h3<{ isPositive?: Boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => (props.isPositive ? "red" : "blue")};
`;

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

interface PriceProps {
  coinId: string;
}

function checkBoolen(value: any) {
  if (value > 0) {
    return true;
  }
  return false;
}

function Price({ coinId }: PriceProps) {
  const { isLoading, data } = useQuery<TickersData>(["price", coinId], () =>
    fetchCoinTickers(coinId)
  );
  const maxPrice: any = data?.quotes.USD.ath_price;
  const curPrice: any = data?.quotes.USD.price;
  const maxPercent: any = (((curPrice - maxPrice) / maxPrice) * 100).toFixed(2);
  console.log(maxPrice, curPrice);
  return (
    <div>
      {isLoading ? (
        "Chart Loading..."
      ) : (
        <>
          <Overview>
            <PriceLists>
              <PriceList>
                <Tag>Price :</Tag>
                <Tag>
                  <span>${data?.quotes.USD.price.toFixed(2)}</span>
                </Tag>
              </PriceList>
              <PriceList>
                <Tag>Curr / Max :</Tag>
                <Text isPositive={checkBoolen(maxPercent)}>{maxPercent}%</Text>
              </PriceList>
              <PriceList>
                <Tag>Change_24h :</Tag>
                <Text
                  isPositive={checkBoolen(data?.quotes.USD.percent_change_24h)}
                >
                  {data?.quotes.USD.percent_change_24h}%
                </Text>
              </PriceList>
              <PriceList>
                <Tag>Change_7d :</Tag>
                <Text
                  isPositive={checkBoolen(data?.quotes.USD.percent_change_7d)}
                >
                  {data?.quotes.USD.percent_change_7d}%
                </Text>
              </PriceList>
              <PriceList>
                <Tag>Change_1M :</Tag>
                <Text
                  isPositive={checkBoolen(data?.quotes.USD.percent_change_30d)}
                >
                  {data?.quotes.USD.percent_change_30d}%
                </Text>
              </PriceList>
              <PriceList>
                <Tag>Change_1Y :</Tag>
                <Text
                  isPositive={checkBoolen(data?.quotes.USD.percent_change_1y)}
                >
                  {data?.quotes.USD.percent_change_1y}%
                </Text>
              </PriceList>
            </PriceLists>
          </Overview>
        </>
      )}
    </div>
  );
}
export default Price;
