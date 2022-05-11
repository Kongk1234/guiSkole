setInterval(() => {
  getLocation()
}, 10000);

function getLocation() {
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function success(pos) {
        let crd = pos.coords;
        document.getElementById("demo").innerHTML = "Lattude: " + crd.latitude + "<br>" + "Longitude: " + crd.longitude + "<br>" + "Accuracy: " + crd.accuracy
        sendData(getCookie("signedIn"), crd.longitude, crd.latitude)
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      
      navigator.geolocation.getCurrentPosition(success, error, options);

     setTimeout(() => {
      getData()
     }, 2000); 
}

function getData() {
  let positionJson = document.getElementById("showJson")
  positionJson.innerHTML = ""
  fetch('/getData',
  )
  .then(response => response.json())
  .then(data => {
      data.forEach(element => {
      if (element.name == getCookie("signedIn")) {
        element.me = "this is you"
      }
      positionJson.innerHTML += JSON.stringify(element) + "<br>"
    });
  }) 
}

function getCookie(name) {
  let cookie = {};
  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    cookie[k.trim()] = v;
  })
  return cookie[name];
}

function sendData(username,longitude,latitude){
  let json = {'name': username, 'longitude': longitude, 'latitude': latitude, 'me': 0}
  fetch('/postData', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
    })
    .then(response => response.json())
    .then(data => {
  
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}
