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

           const proxy = 'http://cors-anywhere.herokuapp.com/';
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

                // Set Icon
                setIcons(icon, document.querySelector('.icon'));

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

            });

        });
   
    } 

    function setIcons(icon, iconID) {
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }  
    
});