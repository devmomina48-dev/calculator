let display = document.getElementById("display");
let btn = document.querySelectorAll("#btn button");
let themeBtn = document.getElementById("theme-btn");
let historyList = document.getElementById("history-list");
let clearHistoryBtn = document.getElementById("clear-history");

let justCalculated = false;
const operatorList = ["+", "-", "x", "÷", "%"];

function isOperator(ch) {
  return operatorList.includes(ch);
}

function calculate(num1, op, num2) {
  if (op === "+") return num1 + num2;
  if (op === "-") return num1 - num2;
  if (op === "x") return num1 * num2;
  if (op === "÷") return num2 === 0 ? NaN : num1 / num2;
  if (op === "%") return num1 % num2;
}

function calculateAll(expression) {
  let numbers = [];
  let operators = [];
  let current = "";

  for (let i = 0; i < expression.length; i++) {
    let ch = expression[i];

    if (isOperator(ch) && current !== "") {
      numbers.push(Number(current));
      operators.push(ch);
      current = "";
    } else {
      current += ch;
    }
  }

  numbers.push(Number(current));

  let i = 0;
  while (i < operators.length) {
    if (operators[i] === "x" || operators[i] === "÷" || operators[i] === "%") {
      numbers[i] = calculate(numbers[i], operators[i], numbers[i + 1]);
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
    } else {
      i++;
    }
  }

  let result = numbers[0];
  for (let j = 0; j < operators.length; j++) {
    result = calculate(result, operators[j], numbers[j + 1]);
  }

  return result;
}

function getCurrentNumber() {
  let text = display.value;
  let start = 0;

  for (let i = 1; i < text.length; i++) {
    if (isOperator(text[i]) && !isOperator(text[i - 1])) {
      start = i + 1;
    }
  }

  return text.slice(start);
}

function addToHistory(expression, result) {
  let li = document.createElement("li");
  li.textContent = expression + " = " + result;
  historyList.prepend(li);
}

btn.forEach((button) => {
  button.addEventListener("click", () => {

    let value = button.textContent.trim();

    if (display.value === "Error") display.value = "";

    let text = display.value;
    let lastChar = text[text.length - 1];

    if (value === "AC") {

      display.value = "";
      justCalculated = false;

    } else if (isOperator(value)) {

      justCalculated = false;

      if (text === "") {
        if (value === "-") display.value = "-";
      } else if (isOperator(lastChar)) {
        if (text.length > 1) display.value = text.slice(0, -1) + value;
      } else {
        display.value += value;
      }

    } else if (value === "=") {

      if (text === "" || isOperator(lastChar)) return;

      let result = calculateAll(text);

      if (isNaN(result)) {
        display.value = "Error";
      } else {
        result = Math.round(result * 1e10) / 1e10;
        addToHistory(text, result);
        display.value = result;
      }
      justCalculated = true;

    } else if (value === "+/-") {

      if (text !== "" && !isNaN(Number(text))) {
        display.value = Number(text) * -1;
      }

    } else if (value === ".") {

      if (justCalculated) {
        display.value = "";
        justCalculated = false;
      }

      let currentNumber = getCurrentNumber();

      if (!currentNumber.includes(".")) {
        if (currentNumber === "" || currentNumber === "-") {
          display.value += "0.";
        } else {
          display.value += ".";
        }
      }

    } else {

      if (justCalculated) {
        display.value = "";
        justCalculated = false;
      }
      display.value += value;
    }
  });
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

clearHistoryBtn.addEventListener("click", () => {
  historyList.innerHTML = "";
});


