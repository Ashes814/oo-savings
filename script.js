const curText = document.querySelector(".total-value");
const rateText = document.querySelector(".rate-text");
const preText = document.querySelector(".pre-text");

const formEl = document.querySelector(".form-input");
const updateButton = document.querySelector(".update-savings");

const initDate = new Date("December 1, 2022");
const initSavings = 200000;

let curTotalSavings = 200000;
let yearlyRate = 0;
let tenYearPrediction = 0;
let passingDays = (new Date() - initDate) / (1000 * 3600 * 24);
console.log(passingDays);

let savingsData = {
  date: [initDate],
  curTotalSavingsList: [initSavings],
  yearlyRateList: [0],
  tenYearPrediction: [0],
};

const init = function () {
  const storage = localStorage.getItem("savingsData");
  if (storage) savingsData = JSON.parse(storage);
};
init();

const calcYearlyRate = function (
  curTotalSavings,
  initSavings = 200000,
  passingDays = new Date() - initDate
) {
  return (
    // Math.pow(Math.pow(curTotalSavings / initSavings, 1 / passingDays), 365) - 1
    (((curTotalSavings - initSavings) / passingDays) * 365) / initSavings
  );
};

const calcTenYearsPrediction = function (curTotalSavings) {
  return (
    curTotalSavings + ((curTotalSavings - initSavings) / passingDays) * 365 * 10
  );
};

// console.log(calcTenYearsPrediction(10, 0.1));
// console.log(calcYearlyRate(250000, 200000, 10));

const updateText = function (curTotalSavings, yearlyRate, tenYearPrediction) {
  curText.textContent = `¥${curTotalSavings.toFixed(2)}`;
  rateText.textContent = `${(yearlyRate * 100).toFixed(2)}%`;
  preText.textContent = `¥${tenYearPrediction.toFixed(2)}`;

  rateText.style.color = yearlyRate > 0 ? "red" : "green";
  preText.style.color = yearlyRate > 0 ? "red" : "green";
};

const updateData = function (
  curTotalSavings,
  yearlyRate,
  tenYearPrediction,
  date = new Date()
) {
  savingsData.curTotalSavingsList.push(curTotalSavings);
  savingsData.yearlyRateList.push(yearlyRate);
  savingsData.tenYearPrediction.push(tenYearPrediction);
  savingsData.date.push(date);
  localStorage.setItem("savingsData", JSON.stringify(savingsData));
};

// updateText(10, 10, 10);
updateButton.addEventListener("click", function () {
  curTotalSavings = +formEl.value;
  // console.log(curTotalSavings);
  // console.log(initSavings);
  // console.log(passingDays);
  yearlyRate = calcYearlyRate(curTotalSavings, initSavings, passingDays);
  //   console.log(yearlyRate);
  tenYearPrediction = calcTenYearsPrediction(curTotalSavings);
  updateData(curTotalSavings, yearlyRate, tenYearPrediction);
  updateText(curTotalSavings, yearlyRate, tenYearPrediction);
  updateFigure();
});

// data for the line chart
const updateFigure = function () {
  let dataTotal = [
    {
      x: savingsData.date,
      y: savingsData.curTotalSavingsList,
      type: "scatter",
      marker: {
        color: "red",
      },
    },
  ];

  let dataRate = [
    {
      x: savingsData.date,
      y: savingsData.yearlyRateList,
      type: "scatter",
      marker: {
        color: "red",
      },
    },
  ];

  let layoutTotal = {
    font: {
      family: "Noto Sans SC, sans-serif",
      size: 18,
      weight: 700,
      color: "#fff",
    },
    title: {
      text: "存款总额",
      x: 0.5,
      y: 0.0085,
    },
    xaxis: {
      // title: "",
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      // title: "存款总额",
      showline: false,
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  let layoutRate = {
    font: {
      family: "Noto Sans SC, sans-serif",
      size: 18,
      weight: "bold",
      color: "#fff",
    },
    title: {
      text: "平均年化增长率",
      x: 0.5,
      y: 0.0085,
    },
    xaxis: {
      // title: "",
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      // title: "平均年化增长率",
      showline: false,
      tickformat: "%",
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };
  Plotly.newPlot("fig-total", dataTotal, layoutTotal);
  Plotly.newPlot("fig-rate", dataRate, layoutRate);
};
// console.log(savingsData.curTotalSavingsList.slice(-1)[0]);
updateText(
  savingsData.curTotalSavingsList.slice(-1)[0],
  savingsData.yearlyRateList.slice(-1)[0],
  savingsData.tenYearPrediction.slice(-1)[0]
);
updateFigure();
