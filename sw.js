// This is the "Offline copy of pages" service worker

const CACHE = "WeatherApp";

const offlineFallbackPage = "index.html";

// Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function (event) {

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {      
      return cache.add(offlineFallbackPage);
    })
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // If request was success, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));

        return response;
      })
      .catch(function () {
        return fromCache(event.request);
      })
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return error page
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}

self.addEventListener('notificationclick', function(event) {  
    console.log('On notification click: ', event.notification.tag);  
    // Android doesn't close the notification when you click on it  
    // See: http://crbug.com/463146  
    event.notification.close();
  
    // This looks to see if the current is already open and  
    // focuses if it is  
    event.waitUntil(
      clients.matchAll({  
        type: "window"  
      })
      .then(function(clientList) {  
        for (var i = 0; i < clientList.length; i++) {  
          var client = clientList[i];  
          if (client.url == '/' && 'focus' in client)  
            return client.focus();  
        }  
        if (clients.openWindow) {
          return clients.openWindow('https://joebailey26.github.io/Weather-App/index.html');  
        }
      })
    );
  });