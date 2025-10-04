


const _city = document.querySelector('.city');
const _temp = document.querySelector('.temp');
const _humidity = document.querySelector('.humidity');
const _wind = document.querySelector('.wind');
const _inp = document.querySelector('.inp');
const _btn = document.querySelector('.btn');
const _weatherImg = document.querySelector('.weather_img');
const _weatherInfo = document.querySelector('.weatherInfo');
const _weather = document.querySelector('.weather');
const _background = document.querySelector('.background');
const _audioPlay = document.getElementById('audioPlay');
const _card = document.querySelector('.card');
const _day = document.querySelector('.day');
const weatherInfoDiv = document.querySelector('.weatherInfo');

const weatherIcons = {
  Clear: "img/clear-day.svg",
  Clouds: "img/overcast-day.svg",
  Mist: "img/fog.svg",
  Rain: "img/11.gif",
  Dust: "img/dust.png",
  Snow: "img/snow.svg",
  Drizzle: "img/drizzle.svg"
};
const apikey = "18b3d49f58d3e2dd8afb45a56c9fb235";
const apiurl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

function getDateString(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' });
}

async function checkWeather(cityName) {
  try {
    const res = await fetch(`${apiurl}${cityName}&appid=${apikey}`);
    if (!res.ok) throw new Error("شهر پیدا نشد یا سرور مشکل دارد");
    const data = await res.json();
    console.log(data);

    /////////////////// وضعیت الان //////////////////////////
    const current = data.list[0];
    _city.innerText = data.city.name;
    _temp.innerText = Math.round(current.main.temp) + '°C';
    _humidity.innerText = current.main.humidity + '%';
    _wind.innerText = current.wind.speed + ' km/h';

    ////////////////////آیکون وضعیت///////////////////////////////////////
    const weatherMain = current.weather[0].main;
    _weatherImg.src = weatherIcons[weatherMain] || "img/default.png";

    //////////////////// بک‌گراند و صدا/////////////////////////////////////
    switch (weatherMain) {
      case "Mist":
        _card.style.backgroundImage = "url('audio/mistgif.gif')";
        _audioPlay.src = "audio/wind-sound-301491.mp3";
        break;
      case "Rain":
        _card.style.backgroundImage = "url('audio/rain-gif.gif')";
        _audioPlay.src = "audio/chill-rain-patreon-sample-364447.mp3";
        break;
      case "Clouds":
        _card.style.backgroundImage = "url('img/U8cAor.gif')";
        _audioPlay.src = "audio/forest-beach-63843.mp3";
        break;
      case "Clear":
        _card.style.backgroundImage = "url('img/افتابی صاف.webp')";
        _audioPlay.src = "audio/nature-sounds-240504.mp3";
        break;
      case "Snow":
        _card.style.backgroundImage = "url('audio/snowgif.gif')";
        _audioPlay.src = "audio/sound-of-falling-snow-211055.mp3";
        break;
      case "Drizzle":
        _card.style.backgroundImage = "url('audio/rain-dezi.gif')";
        _audioPlay.src = "audio/drizzle-4perspectives-23254.mp3";
        break;
      default:
        _card.style.backgroundImage = "";
        _audioPlay.src = "";
    }

    ////////////////// پیش‌بینی 5 روز آینده //////////////////
    const dailyForecasts = [];
    const seenDates = new Set();

    for (let i = 0; i < data.list.length; i++) {
      const date = new Date(data.list[i].dt_txt);
      const day = date.toLocaleDateString("fa-IR", { day: "numeric", month: "numeric" });

      /////////////// فقط یک رکورد از هر روز ساعت 12:00/////////////////
      if (!seenDates.has(day) && dailyForecasts.length < 5) {
        if (date.getHours() === 12) {
          dailyForecasts.push(data.list[i]);
          seenDates.add(day);
        }
      }
    }

    ///////////////////////// ساخت کارت‌ها برای هر روز//////////////////////
    dailyForecasts.forEach((day, index) => {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'day';

      ///////////// تبدیل سرعت باد از متر بر ثانیه به کیلومتر بر ساعت////////////
      const windSpeedKmh = (day.wind.speed * 3.6).toFixed(1);

      ///// برای هر روز، آیکون وضعیت را بر اساس وضعیت هوا در آن روز تنظیم می‌کنیم///////////
      const weatherMain = day.weather[0].main;
      const weatherIcon = weatherIcons[weatherMain] || "img/default.png";

      dayDiv.innerHTML = `
        <div><strong>${getDateString(day.dt_txt)}</strong></div>
        <img  src="${weatherIcon}" alt="${day.weather[0].description}width="120" height="120" />
        <div class=colorday  style="color:black;">°Cدمای هوا: ${Math.round(day.main.temp)}</div>
        <div class=colorday  style="color:black;">%رطوبت: ${day.main.humidity}</div>
        <div class=colorday  style="color:black;">km/hسرعت باد: ${windSpeedKmh} </div>
        <div class=colorday  style="color:red;">وضعیت: ${day.weather[0].main}</div>
      `;

      ////// بک‌گراند هر کارت بر اساس وضعیت همون روز//////////////////////////
      switch (day.weather[0].main) {
        case "Mist":
          dayDiv.style.backgroundImage = "url('audio/mistgif.gif')";
          break;
        case "Rain":
          dayDiv.style.backgroundImage = "url('audio/rain-gif.gif')";
          break;
        case "Clouds":
          dayDiv.style.backgroundImage = "url('img/U8cAor.gif')";
          break;
        case "Clear":
          dayDiv.style.backgroundImage = "url('img/افتابی 1.gif')";
          break;
        case "Snow":
          dayDiv.style.backgroundImage = "url('audio/snowgif.gif')";
          break;
        case "Drizzle":
          dayDiv.style.backgroundImage = "url('audio/rain-dezi.gif')";
          break;
        default:
          dayDiv.style.backgroundImage = "none";
      }

      dayDiv.style.backgroundSize = "cover";
      dayDiv.style.backgroundPosition = "center";
      dayDiv.style.position = "relative";
      dayDiv.style.overflow = "hidden";

      weatherInfoDiv.appendChild(dayDiv);
    });

  } catch (err) {
    console.error(err);
    _city.innerText = "❌ خطا: " + err.message;
    _temp.innerText = _humidity.innerText = _wind.innerText = "";
    _weatherImg.src = "";
  }


  _weatherImg.style.display = 'block';
}


_btn.addEventListener('click', () => {
  weatherInfoDiv.innerHTML = '';
  checkWeather(_inp.value);
});

/////////////// پیش‌بینی روزهای آینده/////////////////
const dailyForecasts = [];
for (let i = 0; i < data.list.length; i += 8) {
  dailyForecasts.push(data.list[i]);
}



