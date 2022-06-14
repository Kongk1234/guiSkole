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

    
function clearCanvas(c) {
  c.height = 300;
}

function createInCanvas(lat, lon, name){
  let canvas = document.getElementById("myCanvas");
  let longitude = (lon * canvas.width) / 360;
  let latitude = (lat * canvas.height) / 180;
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(longitude, latitude, 20, 20);
  ctx.font = "10px Arial";
  ctx.fillText(`hejsa ${name}`, longitude, latitude); 
}

function drawCanvas() {
  let canvas = document.createElement('canvas');
  let slider = document.createElement('input');
  slider.setAttribute('type', 'range');
  slider.setAttribute('id', 'range');
  slider.setAttribute('min', '200');
  slider.setAttribute('max', '750');
  slider.setAttribute('step', '10')
  slider.oninput = getRange;
  canvas.width = '200';
  canvas.height = '200';
  canvas.style.backgroundColor = 'green';
  canvas.id = "myCanvas"
  document.getElementById('sliderBody').appendChild(slider);
  document.getElementById('canvasBody').appendChild(canvas);
}

function getRange(e) {
  let slider = e.target;
  let map = document.getElementById('myCanvas');
  map.width = slider.value;
  map.height = slider.value;
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
    addToCanvas(data)
  }) 
}

function addToCanvas(data) {
 for (let index = 0; index < data.length; index++) {
  const element = data[index];
  createInCanvas(element.latitude, (element.longitude + (index * 100)), element.name);  
 }
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