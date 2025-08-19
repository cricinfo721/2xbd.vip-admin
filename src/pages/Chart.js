import React from "react";
import Highcharts from "highcharts/highstock";
import PieChart from "highcharts-react-official";

const options = {
  chart: {
    type: "pie",
    plotBackgroundColor: "#f0ece1",
    plotBorderWidth: null,
    plotShadow: false,
    borderColor: "#334eff",
  },
  title: {
    text: "",
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
      },
      showInLegend: false,
    },
  },
  series: [
    {
      name: "",
      color: "#006600",
      lineWidth: 1,
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 3,
        states: {
          hover: {
            enabled: true,
            lineWidth: 1,
          },
        },
      },
      data: [
        {
          name: "Cricket",
          y: 7350.3,
        },
        {
          name: "Casino",
          y: 18312.18,
          // sliced: true,
          // selected: true,
        },
        {
          name: "Soccer",
          y: 400.0,
        },
        {
          name: "Tennis",
          y: 99.0,
        },
      ],
    },
  ],
};

const options2 = {
  chart: {
    type: "pie",
    plotBackgroundColor: "#f0ece1",
    plotBorderWidth: null,
    plotShadow: false,
    borderColor: "#334eff",
  },
  title: {
    text: "",
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
      },
      showInLegend: false,
    },
  },
  series: [
    {
      name: "",
      color: "#006600",
      lineWidth: 1,
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 3,
        states: {
          hover: {
            enabled: true,
            lineWidth: 1,
          },
        },
      },
      data: [
        {
          name: "Tennis",
          y: 7353.53,
        },
        {
          name: "Cricket",
          y: 2248929.44,
        },
        {
          name: "Soccer",
          y: 40145.76,
        },
        {
          name: "BasketBall",
          y: 315.0,
        },
        {
          name: "Horse Racing",
          y: 200.0,
        },
        {
          name: "Casino",
          y: 1079667.44,
        },
      ],
    },
  ],
};
const ChartComp = () => {
  return (
    <div className="d-flex p-3 w-100 justify-content-around align-items-center">
      <div className="w-50 p-2">
        <h5
          className="p-2"
          style={{ background: "rgb(44,71,89)", color: "white" }}
        >
          Live Sport Profit
        </h5>
        <PieChart highcharts={Highcharts} options={options} />
      </div>

      <div className="w-50 p-2">
        <h5
          className="p-2"
          style={{ background: "rgb(44,71,89)", color: "white" }}
        >
          Backup Sports Profit
        </h5>
        <PieChart highcharts={Highcharts} options={options2} />
      </div>
    </div>
  );
};

export default ChartComp;
