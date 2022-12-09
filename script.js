const curText = document.querySelector(".total-value");
const rateText = document.querySelector(".rate-text");
const preText = document.querySelector(".pre-text");

const formEl = document.querySelector(".form-input");
const updateButton = document.querySelector(".update-savings");

const initSavings = 200000;

let curTotalSavings = 200000;
let yearlyRate = 0;
let tenYearPrediction = 0;
let passingDays = 10;

let savingsData = {
  date: [],
  curTotalSavingsList: [],
  yearlyRateList: [],
  tenYearPrediction: [],
};

const calcYearlyRate = function (
  curTotalSavings,
  initSavings = 200000,
  passingDays = 10
) {
  return (
    Math.pow(Math.pow(curTotalSavings / initSavings, 1 / passingDays), 365) - 1
  );
};

const calcTenYearsPrediction = function (curTotalSavings, yearlyRate) {
  return curTotalSavings * Math.pow(1 + yearlyRate, 10);
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
  date = 0
) {
  savingsData.curTotalSavingsList.push(curTotalSavings);
  savingsData.yearlyRateList.push(yearlyRate);
  savingsData.tenYearPrediction.push(tenYearPrediction);
  savingsData.date.push(date);
};

// updateText(10, 10, 10);
updateButton.addEventListener("click", function () {
  curTotalSavings = +formEl.value;
  console.log(curTotalSavings);
  console.log(initSavings);
  console.log(passingDays);
  yearlyRate = calcYearlyRate(curTotalSavings, initSavings, passingDays);
  //   console.log(yearlyRate);
  tenYearPrediction = calcTenYearsPrediction(curTotalSavings, yearlyRate);
  updateText(curTotalSavings, yearlyRate, tenYearPrediction);
  updateData(curTotalSavings, yearlyRate, tenYearPrediction);
  console.log(savingsData);
});

// data for the line chart
let data = [
  {
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 3, 2, 1],
    type: "scatter",
    marker: {
      color: "red",
    },
  },
];

// layout for the line chart
var layout = {
  title: "Line Chart",
  xaxis: {
    title: "X Axis",
    showgrid: false,
    zeroline: false,
  },
  yaxis: {
    title: "Y Axis",
    showline: false,
  },
};

// create the line chart
Plotly.newPlot("fig-total", data, layout);
Plotly.newPlot("fig-rate", data, layout);
