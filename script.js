const input = document.getElementById("search");
let t_day_temp = document.getElementById("temp");
const search_btn = document.getElementById("search_button");
search_btn.addEventListener("click", (e) => {
  if (input.value === "") {
    document.getElementById("city_name").innerText = "Input City Name";
  } else {
    let city = input.value;
    document.getElementById("city_name").innerText = city.toUpperCase();

    weather_search(city);
  }
});

async function weather_search(city_name) {
  try {
    const location_finder = `https://geocoding-api.open-meteo.com/v1/search?name=${city_name}`;
    const locate_req = await fetch(location_finder);
    const location_response = await locate_req.json();
    const latitude = location_response.results[0].latitude;
    const longitude = location_response.results[0].longitude;
    const weather_api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weathercode&daily=temperature_2m_max,temperature_2m_min,uv_index_max,weathercode&timezone=auto`;
    const weather_req = await fetch(weather_api);
    const weather_response = await weather_req.json();

    t_day_temp.innerText =
      Math.floor(weather_response.current.temperature_2m) + "°"; //temp
    document.getElementById("tday_feels").innerText =
      Math.floor(weather_response.current.apparent_temperature) + "°";
    document.getElementById("tday_wind").innerText =
      Math.floor(weather_response.current.wind_speed_10m) + "km/h";
    document.getElementById("uv_index").innerText =
      Math.floor(weather_response.daily.uv_index_max[0]) + " max";

    //entry in dom forecast temp

    const elements = document.querySelectorAll(".temp_forecast");
    const temperatures_max = weather_response.daily.temperature_2m_max;
    const temperatures_min = weather_response.daily.temperature_2m_min;

    elements.forEach((element, index) => {
      if (index < temperatures_max.length) {
        element.innerText = `${Math.floor(
          temperatures_max[index]
        )}/${Math.floor(temperatures_min[index])}`;
      }
    }); //add temp by index number

    //entry forecast temp in dom end
    // find hour index of current time

    const this_day = new Date();
    const this_date = this_day.getDate();

    const this_hour = this_day.getHours();

    const weather_hours = weather_response.hourly.time;
    const current_hour_index = weather_hours.findIndex((time) => {
      const date = new Date(time);
      const day = date.getDate();
      const hour = date.getHours();
      return this_date === day && this_hour === hour;
    });

    // hour name
    const next_6_hour = weather_response.hourly.time.slice(
      current_hour_index + 1,
      current_hour_index + 7
    );

    const today_forecast_hour = document.querySelectorAll(".hour");
    today_forecast_hour.forEach((hours_element, index) => {
      const current_hour = new Date(next_6_hour[index]).getHours();
      if (current_hour >= 12) {
        hours_element.innerText =
          new Date(next_6_hour[index]).getHours() - 12 + ":00 Pm";
      } else {
        hours_element.innerText =
          new Date(next_6_hour[index]).getHours() + ":00 Am";
      }
      if (hours_element.innerText === "0:00 Am") {
        hours_element.innerText = "12:00 Am";
      }
    });

    //entry hour temp
    const temp_hour = weather_response.hourly.temperature_2m;

    const hour_6_temp = temp_hour.slice(
      current_hour_index + 1,
      current_hour_index + 7
    );
    const hours_element = document.querySelectorAll(".hour_temp");

    hours_element.forEach((element, index) => {
      element.innerText = Math.floor(hour_6_temp[index]);
    });
    // hours rain probability
    const weather_code_hours = weather_response.hourly.weathercode;

    const hour_6_rain = weather_code_hours.slice(
      current_hour_index + 1,
      current_hour_index + 7
    );
    const rain_element = document.querySelectorAll(".weather_img");
    rain_element.forEach((element, index) => {
      element.value = hour_6_rain[index];

      if (element.value <= 5) {
        element.src = "/icon-img/weather_img/sun.png";
      } else if (element.value <= 48) {
        element.src = "/icon-img/weather_img/sun and rain.png";
      } else if (element.value <= 80) {
        element.src = "/icon-img/weather_img/rain.png";
      } else if (element.value <= 86) {
        element.src = "/icon-img/weather_img/snow.png";
      } else if (element.value > 95) {
        element.src = "/icon-img/weather_img/thunder.png";
      }
    });

    // forecast 7 days
    const weather_code_7days = weather_response.daily.weathercode;

    const forecast_7_img = document.querySelectorAll(".Seven_d_img");
    const forecast_elem = document.querySelectorAll(".bold");

    const next_7_Day = weather_response.daily.time;
    const element_7days = document.querySelectorAll(".days");

    element_7days.forEach(async (element, index) => {
      element_7days.value = next_7_Day[index];

      let element_name = await day_name(element_7days.value);
      element.innerText = element_name;
    });

    forecast_7_img.forEach((element, index) => {
      element.value = weather_code_7days[index];

      const forecast_text = forecast_elem[index];
      if (element.value <= 5) {
        element.src = "/icon-img/weather_img/sun.png";
        forecast_text.innerText = "sunny";
      } else if (element.value <= 48) {
        element.src = "/icon-img/weather_img/sun and rain.png";
        forecast_text.innerText = "cloudy";
      } else if (element.value <= 80) {
        element.src = "/icon-img/weather_img/rain.png";
        forecast_text.innerText = "Rainy";
      } else if (element.value <= 86) {
        element.src = "/icon-img/weather_img/snow.png";
        forecast_text.innerText = "Snow";
      } else if (element.value >= 95) {
        element.src = "/icon-img/weather_img/thunder.png";
        forecast_text.innerText = "Thunder";
      }
    });
    const rain_probability =
      weather_response.hourly.precipitation_probability.slice(0, 24);
    const high_probability = Math.max(...rain_probability);

    document.getElementById(
      "chance_rain"
    ).innerText = `Chance of Rain:${high_probability}%`;
    document.getElementById("chance_rain_second").innerText =
      high_probability + "%";
    const today_img = document.getElementById("first_img").src;

    document.getElementById("current_w_img").src = today_img;
  } catch (error) {
    document.getElementById("city_name").innerText = "Unknown city";
    document.querySelectorAll(".all").forEach((element) => {
      element.innerText = "..";
    });
    document.querySelectorAll(".img_all").forEach((img) => {
      img.src = "";
    });
  }
}

async function day_name(date_name) {
  let week = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const date = new Date(date_name);
  let day_index = date.getDay();
  let day_name = week[day_index];
  return day_name;
}


