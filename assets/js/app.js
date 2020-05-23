window.addEventListener('load', ()=> {

    document.querySelector(".notifications").addEventListener("click", () => {Notification.requestPermission();})

    const temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    const locationTimezone = document.querySelector(".location-timezone");
    let temperatureFormat = document.querySelector(".temperature sup");

    if (window.CSS.registerProperty) { 
        window.CSS.registerProperty({
            name: '--color-one',
            syntax: '<color>',
            inherits: true, // Boolean, if true should inherit down the DOM tree
            initialValue: '#121212', // String, initial value of this property
        });
    
        window.CSS.registerProperty({
            name: '--color-two',
            syntax: '<color>',
            inherits: true, // Boolean, if true should inherit down the DOM tree
            initialValue: '#121212', // String, initial value of this property
        });
    
        window.CSS.registerProperty({
            name: '--main-color',
            syntax: '<color>',
            inherits: true, // Boolean, if true should inherit down the DOM tree
            initialValue: '#121212', // String, initial value of this property
        });
    
        window.CSS.registerProperty({
            name: '--text-weight',
            syntax: '<number>',
            inherits: true, // Boolean, if true should inherit down the DOM tree
            initialValue: '400', // String, initial value of this property
        });
    
        window.CSS.registerProperty({
            name: '--text-width', // String, name of the custom property
            syntax: '<percentage>', // String, how to parse this property. Defaults to *
            inherits: true, // Boolean, if true should inherit down the DOM tree
            initialValue: '100%', // String, initial value of this property
        });
    
        window.CSS.registerProperty({
            name: '--drawing-color', // String, name of the custom property
            syntax: '<color>', // String, how to parse this property. Defaults to *
            inherits: true, // Boolean, if true should inherit down the DOM tree
            initialValue: 'black', // String, initial value of this property
        });
    
        window.CSS.registerProperty({
            name: '--lat',
            syntax: '<number>',
            inherits: true, // Boolean, if true should inherit down the DOM tree
            initialValue: '0', // String, initial value of this property
        });
    
        window.CSS.registerProperty({
            name: '--long',
            syntax: '<number>',
            inherits: true, // Boolean, if true should inherit down the DOM tree
            initialValue: '0', // String, initial value of this property
        });
    }
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            //Set Lat and Long Co-Ords
            let long = position.coords.longitude;
            let lat = position.coords.latitude;
            let drawingLat;
            let drawingLong;

            //Create drawings
            if (CSS.paintWorklet) { 
                CSS.paintWorklet.addModule('assets/js/drawing.js');
            }
            if (lat < 0) {
                drawingLat = Math.abs(lat)
            }
            else {
                drawingLat = lat
            };
            if (long < 0) {
                drawingLong = Math.abs(long)
            }
            else {
                drawingLong = long
            };
            if (drawingLong < 10) {
                drawingLong = drawingLong * 10
            };
            if (drawingLat < 10) {
                drawingLat = drawingLat * 10
            }
            if (drawingLong > 10) {
                drawingLong = drawingLong / 5
            };
            if (drawingLat > 10) {
                drawingLat = drawingLat / 5
            }
            document.body.style.setProperty('--lat', drawingLat * 1.5);
            document.body.style.setProperty('--long', drawingLong * 1.5);
            document.body.style.setProperty('--drawing-color', 'rgba(' + drawingLat + ',' + drawingLong + ',' + drawingLat + ',' + 0.1 + ')');

            // Create Drawing HTML Element
            class DrawingDiv extends HTMLElement {
                constructor() {
                    // Always call super first in constructor
                    super();

                    // Create a shadow root
                    var shadow = this.attachShadow({mode: 'open'});
            
                    // Create element
                    var wrapper = document.createElement('div');
                    wrapper.setAttribute('class','drawing');

                    // Attach styles
                    let top = Math.random() * 50;
                    let left = Math.random() * 50;
                    if (top > 70) {
                        top = 70
                    }
                    if (left > 70) {
                        left = 70
                    }
                    wrapper.style.top = top + "%";
                    wrapper.style.left = left + "%";

                    // Create some CSS to apply to the shadow dom
                    var style = document.createElement('style');

                    style.textContent = '.drawing {border-radius: 0;background-image: paint(drawing);position: absolute;width: 100px;height: 100px;z-index: -3;}'
            
                    // Attach the created elements to the shadow dom
                    shadow.appendChild(style);
                    shadow.appendChild(wrapper);
                }
            }

            customElements.define('drawing-div', DrawingDiv);

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            let api = `${proxy}https://api.darksky.net/forecast/6d17568a176251f3630f210af5bd987e/${lat},${long}`;

            function getWeather(refresh) {
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
        
                        var precipIntensity = data.currently.precipIntensity;
        
                        // Celsius
                        let celsius = (temperature - 32) * (5 / 9);
                        temperatureDegree.textContent = Math.floor(celsius);
                        addTempFormat("C");
        
                        // Change temperature to Celsius/Farenheit 
                        function addTempFormat(format) {
                            let sup = document.createElement("sup");
                            let node = document.createTextNode(format);
                            sup.appendChild(node);
                            temperatureDegree.appendChild(sup);
                        };
        
                        temperatureDegree.addEventListener('click', () => {
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
        
                        //Set colors and text based on weather conditions
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
                            rainIntensity();
                        }
                        else if (icon === "snow", "sleet") {
                            document.body.style.setProperty('--color-two', '#FFFFFF');
                        }
                        else {
                            document.body.style.setProperty('--color-two', '#B4BAC6');
                        }
        
                        //Change rain intensity
                        function rainIntensity() {
                            if (precipIntensity < 0.25) {
                                document.querySelectorAll(".stem").forEach(element => {
                                    element.style.width = "1px";
                                });
                            }
                            else if (precipIntensity < 0.50) {
                                document.querySelectorAll(".stem").forEach(element => {
                                    element.style.width = "2px";
                                });
                            }
                            else if (precipIntensity > 0.50) {
                                document.querySelectorAll(".stem").forEach(element => {
                                    element.style.width = "3px";
                                });
                            }
                        }
        
                        // Set Icon
                        setIcons(icon, document.querySelector('.icon'));
        
                        function setIcons(icon, iconID) {
                            const skycons = new Skycons({color: "#000"});
                            const currentIcon = icon.replace(/-/g, "_").toUpperCase();
                            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                                skycons.play();
                            }
                            return skycons.set(iconID, Skycons[currentIcon]);
                        }
        
                        //Create speak-aloud event
                        document.querySelector(".read-aloud").addEventListener('click', () => {
                            window.speechSynthesis.speak(new SpeechSynthesisUtterance("The temperature in " + data.timezone + " is currently " + Math.floor(celsius) + " degrees celsius. " + "Expect " + summary));
                        })

                        //Create vibrate event
                        document.querySelector(".vibrate").addEventListener('click', () => {
                           window.navigator.vibrate(500) 
                        })
    
                        //Create share event
                        document.querySelector(".share").addEventListener('click', () => {
                            if (navigator.share) {
                                navigator.share({
                                title: 'Weather App',
                                text: 'This is a weather app',
                                url: 'https://joebailey26.github.io/Weather-App/index.html',
                                })
                            }
                            else {
                                window.open('mailto:?subject=Weather App', '_blank');
                            }
                        })

                        document.body.classList.add("loaded");

                        //Send Notification
                        if (refresh) {
                            if (Notification.permission == 'granted') {
                                navigator.serviceWorker.getRegistration().then(function(reg) {
                                    var options = {
                                        body: 'Expect ' + summary,
                                        icon: 'android-chrome-192x192.png',
                                        vibrate: [100, 50, 100],
                                        data: {
                                            dateOfArrival: Date.now(),
                                            primaryKey: 1
                                        }
                                    };
                                    reg.showNotification('It is ' + Math.floor(celsius) + '° right now', options);
                                });
                            }
                        }
                    })
            }
            getWeather();

            //Refresh weather after 30 minutes
            setInterval(function(){ getWeather("yes"); }, 1.8e+6);
        })
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

    //Add rain drops to DOM
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
