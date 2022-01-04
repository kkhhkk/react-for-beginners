import { useQuery } from "react-query";
import { fetchChartHistorical } from "../api";
import ApexChart from "react-apexcharts";
import { useParams, useRouteMatch } from "react-router-dom";

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

interface Chart2Props {
  coinId: string;
}

interface DateParams {
  setDate: string;
}

function changeSetDate(value: string) {
  if (value === "3m") {
    return "3M";
  } else if (value === "1m") {
    return "1M";
  } else {
    return value;
  }
}

function Chart2({ coinId }: Chart2Props) {
  const chartMatch1Y = useRouteMatch("/:coinId/chart/1y");
  const { setDate } = useParams<DateParams>();
  const { isLoading, data } = useQuery<IChartData[]>(
    [`ohlcv${setDate}}`, coinId],
    () => fetchChartHistorical(coinId, setDate)
  );
  const value = changeSetDate(setDate);

  return (
    <div>
      {isLoading ? (
        "Chart Loading..."
      ) : chartMatch1Y === null ? (
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
              type: "candlestick",
              width: 500,
              height: 500,
              background: "transparent",
              toolbar: {
                show: false,
              },
            },
            title: {
              text: `Chart of ${value} - Daily close price`,
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
            tooltip: {
              enabled: true,
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
    </div>
  );
}

export default Chart2;
