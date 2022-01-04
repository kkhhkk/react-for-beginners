import { Switch, Route, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoinHistorical } from "../api";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import Chart2 from "./Chart2";

const ChartBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Tab = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 10px 5px 10px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
`;

interface IChartData {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const chartMatch1Y = useRouteMatch("/:coinId/chart/1y");
  const chartMatch3M = useRouteMatch("/:coinId/chart/3m");
  const chartMatch1M = useRouteMatch("/:coinId/chart/1m");
  const chartMatch14d = useRouteMatch("/:coinId/chart/14d");
  const chartMatch7d = useRouteMatch("/:coinId/chart/7d");
  const { isLoading, data } = useQuery<IChartData[]>(["ohlcv", coinId], () =>
    fetchCoinHistorical(coinId)
  );

  return (
    <div>
      <ChartBar>
        <Tab isActive={chartMatch1Y !== null}>
          <Link to={`/${coinId}/chart/1y`}>1Y</Link>
        </Tab>
        <Tab isActive={chartMatch3M !== null}>
          <Link to={`/${coinId}/chart/3m`}>3M</Link>
        </Tab>
        <Tab isActive={chartMatch1M !== null}>
          <Link to={`/${coinId}/chart/1m`}>1M</Link>
        </Tab>
        <Tab isActive={chartMatch14d !== null}>
          <Link to={`/${coinId}/chart/14d`}>14d</Link>
        </Tab>
        <Tab isActive={chartMatch7d !== null}>
          <Link to={`/${coinId}/chart/7d`}>7d</Link>
        </Tab>
      </ChartBar>
      {isLoading ? (
        ""
      ) : chartMatch1Y !== null ? (
        <ApexChart
          type="candlestick"
          series={[
            {
              name: "Price",
              data: data?.map((price) => ({
                x: price.time_close.slice(5, 10),
                y: [
                  price.open.toFixed(2),
                  price.high.toFixed(2),
                  price.low.toFixed(2),
                  price.close.toFixed(2),
                ],
              })),
            },
          ]}
          options={{
            theme: { mode: "dark" },
            chart: {
              width: 500,
              height: 500,
              background: "transparent",
              toolbar: {
                show: false,
              },
            },
            colors: data?.map((price) =>
              price.open - price.close > 0 ? `#e84118` : `#00a8ff`
            ),
            title: {
              text: "Chart of 1Y - Daily close price",
              align: "left",
            },
            xaxis: {
              categories: [data?.map((date) => date.time_close.slice(5, 10))],
              labels: {
                style: {
                  fontSize: "11px",
                },
                show: false,
              },
              axisTicks: {
                show: false,
              },
            },
            stroke: {
              curve: "smooth",
              width: 1,
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#e84118",
                  downward: "#0097e6",
                },
              },
            },
          }}
        />
      ) : (
        <></>
      )}
      <Switch>
        <Route path={`/:coinId/chart/:setDate`}>
          <Chart2 coinId={coinId} />
        </Route>
      </Switch>
    </div>
  );
}

export default Chart;
