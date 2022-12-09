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
  date: [new Date("December 31, 2020"), new Date("December 31, 2021")],
  curTotalSavingsList: [200000, 220000],
  yearlyRateList: [0.4, 0.5],
  tenYearPrediction: [300000, 500000],
};

const init = function () {
  const storage = localStorage.getItem("savingsData");
  if (storage) savingsData = JSON.parse(storage);
};
init();

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
  tenYearPrediction = calcTenYearsPrediction(curTotalSavings, yearlyRate);
  updateText(curTotalSavings, yearlyRate, tenYearPrediction);
  updateData(curTotalSavings, yearlyRate, tenYearPrediction);
  updateFigure();
});

// data for the line chart
const updateFigure = function () {
  let data = [
    {
      x: savingsData.date,
      y: savingsData.curTotalSavingsList,
      type: "scatter",
      marker: {
        color: "red",
      },
    },
  ];
  let layout = {
    title: "Line Chart",
    xaxis: {
      title: "日期",
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      title: "存款余额",
      showline: false,
    },
  };
  Plotly.newPlot("fig-total", data, layout);
  Plotly.newPlot("fig-rate", data, layout);
};

updateFigure();
