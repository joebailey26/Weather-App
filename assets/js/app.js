window.addEventListener('load', ()=> {
    const temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    const locationTimezone = document.querySelector(".location-timezone");
    const temperatureSection = document.querySelector(".temperature");
    let temperatureFormat = document.querySelector(".temperature sup");

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
           //Set Lat and Long Co-Ords
           let long = position.coords.longitude;
           let lat = position.coords.latitude;

           const proxy = 'https://cors-anywhere.herokuapp.com/';
           let api = `${proxy}https://api.darksky.net/forecast/b7d0f9fb3a1cfad18566f72d1a59fade/${lat},${long}`;
           
           fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                //Get Data
                let {temperature, summary, icon } = data.currently;

                //Set DOM Elements from the APi
                temperatureDegree.textContent = temperature;
                temperatureDescription.textContent = summary;
                locationTimezone.textContent = data.timezone;

                // Celsius
                let celsius = (temperature - 32) * (5 / 9);
                temperatureDegree.textContent = Math.floor(celsius);
                addTempFormat("C");

                function addTempFormat(format) {
                    let sup = document.createElement("sup");
                    let node = document.createTextNode(format);
                    sup.appendChild(node);
                    temperatureDegree.appendChild(sup);
                };

                if (celsius < 0) {
                    document.body.style.setProperty('--color-one', '#4078C0');
                    document.body.style.setProperty('--color-two', '#4078C0');
                    document.body.style.setProperty('--text-weight', '950');
                    document.body.style.setProperty('--text-width', '125%');
                }
                else if (celsius < 10) {
                    document.body.style.setProperty('--color-one', '#BAB9B9');
                    document.body.style.setProperty('--color-two', '#BAB9B9');
                    document.body.style.setProperty('--text-weight', '712.5');
                    document.body.style.setProperty('--text-width', '112.5%');
                }
                else if (celsius < 20) {
                    document.body.style.setProperty('--color-one', '#FEEC37');
                    document.body.style.setProperty('--color-two', '#FEEC37');
                    document.body.style.setProperty('--text-weight', '475');
                    document.body.style.setProperty('--text-width', '100%');
                }
                else if (celsius < 30) {
                    document.body.style.setProperty('--color-one', '#F38B1E');
                    document.body.style.setProperty('--color-two', '#F38B1E');
                    document.body.style.setProperty('--text-weight', '237.5');
                    document.body.style.setProperty('--text-width', '87.5%');
                }
                else if (celsius < 30) {
                    document.body.style.setProperty('--color-one', '#F0050F');
                    document.body.style.setProperty('--color-two', '#F0050F');
                    document.body.style.setProperty('--text-weight', '125');
                    document.body.style.setProperty('--text-width', '75%');
                }

                if (icon === "clear-day") {
                    document.body.style.setProperty('--color-one', '#2C38A7');
                }
                else if (icon === "clear-night") {
                    document.body.style.setProperty('--color-one', '#1C293A');
                }
                else if (icon === "rain") {
                    document.body.style.setProperty('--color-two', '#264184');
                    makeItRain();
                }
                else if (icon === "snow", "sleet") {
                    document.body.style.setProperty('--color-two', '#FFFFFF');
                }
                else {
                    document.body.style.setProperty('--color-two', '#B4BAC6');
                }

                // Set Icon
                setIcons(icon, document.querySelector('.icon'));

                document.querySelector(".read-aloud").addEventListener('click', () => {
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("The temperature in " + data.timezone + " is currently " + Math.floor(celsius) + " degrees celsius. " + "Expect " + summary));
                })

                // Change temperature to Celsius/Farenheit 
                temperatureSection.addEventListener('click', () => {
                    temperatureDegree = document.querySelector(".temperature-degree");
                    temperatureFormat = document.querySelector(".temperature sup");
                    if (temperatureFormat.textContent === "F") {
                        temperatureDegree.textContent = Math.floor(celsius);
                        addTempFormat("C");
                    }
                    else {
                        temperatureDegree.textContent = temperature;
                        addTempFormat("F");
                    }
                })

                document.body.classList.add("loaded");

            });

        });
   
    } 

    function setIcons(icon, iconID) {
        const skycons = new Skycons({color: "#000"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            skycons.play();
        }
        return skycons.set(iconID, Skycons[currentIcon]);
    }  
    
});

var makeItRain = function() {  
    var increment = 0;
    var drops = "";
    var backDrops = "";
  
    while (increment < 100) {
      //couple random numbers to use for various randomizations
      //random number between 98 and 1
      var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
      //random number between 5 and 2
      var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
      //increment
      increment += randoFiver;
      //add in a new raindrop with various randomizations to certain CSS properties
      drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
      backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
    }

    if (increment > 100) {
        var rootNodeStartOne = '<div class="rain front-row">';
        var rootNodeStartTwo = '<div class="rain back-row">';
        var rootNodeEnd = '</div>';
        var rootNodedrops = rootNodeStartOne + drops + rootNodeEnd;
        var rootNodeBackDrops = rootNodeStartTwo + backDrops + rootNodeEnd;
        document.body.insertAdjacentHTML('afterbegin', rootNodedrops);
        document.body.insertAdjacentHTML('afterbegin', rootNodeBackDrops);
    }
  }
  