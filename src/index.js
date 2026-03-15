 import "./styles/style.css";
 import pendingIcon from "./icons/spinner.svg";
 import { addDays, format } from "date-fns";
 import { weatherIcons } from "./support.js";

 const getWeather = async (city) => {
   const TotalWeathers = [];
   const now = new Date();
   const startDate = format(now, "yyyy-MM-dd");
   const endDate = format(addDays(now, 2), "yyyy-MM-dd");
   const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${startDate}/${endDate}?unitGroup=metric&key=55HR853VVG6LHX5XG7MANWQFQ`;
   const response = await fetch(url);
   if (!response.ok) throw new Error("API request failed");
   const data = await response.json();
   for (let i = 0; i < 3; ++i) {
     const weather = {
       city: data.address,
       date: data.days[i].datetime,
       tempmin: data.days[i].tempmin,
       tempmax: data.days[i].tempmax,
       temp: data.days[i].temp,
       condition: data.days[i].conditions,
       icon: data.days[i].icon,
       description: data.days[i].description,
     };
     TotalWeathers.push(weather);
   }
   console.log(TotalWeathers);
   return TotalWeathers;
 };

 const weatherApp = (() => {
   //cache DOM
   const cacheDOM = {
     currentContainer: document.querySelector(".current-container"),
     majorContainer: document.querySelector(".major-container"),
     searchInput: document.querySelector("#search-input"),
     searchBtn: document.querySelector("#search-btn"),
     inputContainer: document.querySelector(".input-container"),
   };
   // render html
   const renderCurrentLocation = (weathers) => {
     cacheDOM.currentContainer.classList.add("success");
     const now = new Date();
     for (let i = 0; i < 3; ++i) {
       const date = addDays(now, i);
       const parent = document.createElement("div");
       parent.classList.add("weather");
       const paraContainer = document.createElement("div");
       paraContainer.classList.add("para-container");
       const city = document.createElement("p");
       city.classList.add("city");
       city.textContent = weathers[i].city.split("-").join(" ");
       const time = document.createElement("p");
       time.classList.add("time");
       time.textContent = format(date, "EEE, MMMM d");
       const condition = document.createElement("p");
       condition.classList.add("condition");
       condition.textContent = weathers[i].condition;
       const symbolContainer = document.createElement("div");
       symbolContainer.classList.add("symbol-container");
       const one = document.createElement("div");
       one.classList.add("one");
       const image = document.createElement("img");
       image.src = weatherIcons[weathers[i].icon];
       const temp = document.createElement("p");
       temp.textContent = weathers[i].temp + "°";
       const minmaxTemp = document.createElement("p");
       minmaxTemp.classList.add("two");
       minmaxTemp.textContent = `${weathers[i].tempmin}° / ${weathers[i].tempmax}°`;
       parent.classList.add("weather");
       if (i == 0) {
         parent.classList.add("today");
       } else if (i == 1) {
         parent.classList.add("tomorrow");
       } else {
         parent.classList.add("after-tomorrow");
       }

       paraContainer.append(city, time, condition);
       one.append(image, temp);
       symbolContainer.append(one, minmaxTemp);
       parent.append(paraContainer, symbolContainer);
       cacheDOM.currentContainer.append(parent);
     }
   };

   //render pending
   const renderPending = () => {
     cacheDOM.currentContainer.classList.add("pending");
     const container = document.createElement("div");
     container.classList.add("spinner-container");
     const icon = document.createElement("img");
     icon.src = pendingIcon;
     icon.id = "spinner";
     container.appendChild(icon);
     cacheDOM.currentContainer.appendChild(container);
   };
   //remove pending icon
   const removePending = () => {
     const pendingContainer =
       cacheDOM.currentContainer.querySelector(".spinner-container");
     cacheDOM.currentContainer.classList.remove("pending");
     pendingContainer.remove();
   };
   //render error message
   const renderError = (errorMessage) => {
     cacheDOM.currentContainer.innerHTML = ""; // clear any previous state
     cacheDOM.currentContainer.classList.remove("success", "pending");
     const errorCard = document.createElement("div");
     errorCard.classList.add("error-text");
     errorCard.textContent = errorMessage;
     cacheDOM.inputContainer.appendChild(errorCard);
   };
   //remove error message
   const removeError = () => {
     const errorTag = cacheDOM.inputContainer.querySelector(".error-text");
     if (errorTag) errorTag.remove();
   };
   //recieve city input
   const getCity = async () => {
     let location = cacheDOM.searchInput.value.trim();
     if (!location) return;
     removeError();
     cacheDOM.searchInput.value = "";
     cacheDOM.currentContainer.innerHTML = "";
     location = location.split(" ").join("-");
     renderPending();
     try {
       const response = await getWeather(location);
       removePending();
       cacheDOM.currentContainer.classList.add("success");
       renderCurrentLocation(response);
     } catch (error) {
       removePending();
       renderError("No result found");
     }
   };
   //event listener
   const bindEvent = () => {
     cacheDOM.searchBtn.addEventListener("click", getCity);
     document.addEventListener("keydown", (e) => {
       if (e.key == "Enter" && cacheDOM.searchInput.value) getCity();
     });
   };
   const init = () => {
     bindEvent();
   };
   return { init };
 })();
 weatherApp.init();

 //defeault major cities
 const getDefaultWeather = async (city) => {
   const now = new Date();
   const date = format(now, "yyyy-MM-dd");
   const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${date}?unitGroup=metric&key=55HR853VVG6LHX5XG7MANWQFQ`;
   const response = await fetch(url);
   if (!response.ok) throw new Error("API request failed");
   const data = await response.json();
   const weather = {
     city: data.address,
     date: data.days[0].datetime,
     tempmin: data.days[0].tempmin,
     tempmax: data.days[0].tempmax,
     temp: data.days[0].temp,
     condition: data.days[0].conditions,
     icon: data.days[0].icon,
     description: data.days[0].description,
   };
   return weather;
 };

 const defaultCities = (async () => {
   const majorCities = [
     "newyork",
     "london",
     "tokyo",
     "dubai",
     "capetown",
     "sydney",
   ];
   const cacheDOM = {
     majorContainer: document.querySelector(".major-container"),
     majorWeatherContainer: document.querySelector(".major-weather-container"),
     majorHeader: document.querySelector(".major-header"),
     london: document.querySelector(".london"),
     dubai: document.querySelector(".dubai"),
     tokyo: document.querySelector(".tokyo"),
     sydney: document.querySelector(".sydney"),
     capeTown: document.querySelector(".cape-town"),
     newYork: document.querySelector(".new-york"),
   };

   //render default cities
   const rendercity = (weather) => {
     const date = new Date();
     const parent = document.createElement("div");
     parent.classList.add("weather");
     const paraContainer = document.createElement("div");
     paraContainer.classList.add("para-container");
     const city = document.createElement("p");
     city.classList.add("city");
     city.textContent = weather.city.split("-").join(" ");
     const time = document.createElement("p");
     time.classList.add("time");
     time.textContent = format(date, "EEE, MMMM d");
     const condition = document.createElement("p");
     condition.classList.add("condition");
     condition.textContent = weather.condition;
     const symbolContainer = document.createElement("div");
     symbolContainer.classList.add("symbol-container");
     const one = document.createElement("div");
     one.classList.add("one");
     const image = document.createElement("img");
     image.src = weatherIcons[weather.icon];
     const temp = document.createElement("p");
     temp.textContent = weather.temp + "°";
     const minmaxTemp = document.createElement("p");
     minmaxTemp.classList.add("two");
     minmaxTemp.textContent = `${weather.tempmin}° / ${weather.tempmax}°`;
     paraContainer.append(city, time, condition);
     one.append(image, temp);
     symbolContainer.append(one, minmaxTemp);
     parent.append(paraContainer, symbolContainer);
     cacheDOM.majorWeatherContainer.append(parent);
   };

   for (const majorCity of majorCities) {
     try {
       const weather = await getDefaultWeather(majorCity);
       rendercity(weather);
     } catch (error) {
       console.error(`${majorCity} data not found`);
       continue;
     }
   }
 })();

 // Celsius to Fahrenheit
 function cToF(celsius) {
   let f = (celsius * 9) / 5 + 32;
   return f % 1 === 0 ? f : parseFloat(f.toFixed(1));
 }

 // Fahrenheit to Celsius
 function fToC(fahrenheit) {
   let c = ((fahrenheit - 32) * 5) / 9;
   return c % 1 === 0 ? c : parseFloat(c.toFixed(1));
 }
 const tempUnitChange = (() => {
   let flag = "C";
   const unitSwitch = document.querySelector("#switch");
   const renderChange = () => {
     const weathers = document.querySelectorAll(".weather");
     if (!weathers) return;
     for (const weather of weathers) {
       const minmax = weather.querySelector(".two");
       const temp = weather.querySelector(".one p");
       let tempNumber = temp.textContent.split("°")[0];
       const minmaxNumber = minmax.textContent.split("° / ");
       let min = minmaxNumber[0];
       let max = minmaxNumber[1].split("°")[0];
       if (flag == "C") {
         tempNumber = fToC(tempNumber);
         min = fToC(min);
         max = fToC(max);
       } else if (flag == "F") {
         tempNumber = cToF(tempNumber);
         min = cToF(min);
         max = cToF(max);
       }
       temp.textContent = tempNumber + "°";
       minmax.textContent = `${min}° / ${max}°`;
     }
   };
   const switchChange = () => {
     if (unitSwitch.checked) flag = "F";
     else flag = "C";
     renderChange();
   };
   const bindEvent = () => {
     unitSwitch.addEventListener("change", switchChange);
   };
   const init = () => {
     bindEvent();
   };
   return { init };
 })();
 tempUnitChange.init();
 
 