//api key
const API_KEY = "4a4e8eeba8e61a591053a24c";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const exchangeIcon = document.querySelector(".dropdown i");

// Populate dropdowns
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ✅ Update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/pair/${fromCurr.value}/${toCurr.value}`;
  try {
    let response = await fetch(URL);
    let data = await response.json();

    if (data.result === "error") {
      msg.innerText = `Error: ${data["error-type"]}`;
      return;
    }

    let rate = data.conversion_rate;
    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    msg.innerText = "Failed to fetch exchange rate!";
    console.error(err);
  }
};

// ✅ Update flag function
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// ✅ Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// ✅ Swap currencies on arrow click
exchangeIcon.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

// Auto update on load
window.addEventListener("load", () => {
  updateExchangeRate();
});


