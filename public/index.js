
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

let personArr = []
function createInCanvas(lat, lon, name, me){
  let personobj = {"lat": lat, "lon": lon, "me": me, "name": name}
  personArr.push(personobj)
  let canvas = document.getElementById("myCanvas");
  let longitude = (lon * canvas.width) / 360;
  let latitude = (lat * canvas.height) / 180;
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  if (me == "this is you") {
    ctx.fillRect((canvas.width / 2), (canvas.height / 2), 20, 20);
    ctx.font = "10px Arial";
    ctx.fillText(`hejsa ${name}`, (canvas.width / 2), (canvas.height / 2));  
  }
  else{
    ctx.fillRect(longitude, latitude, 20, 20);
    ctx.font = "10px Arial";
    ctx.fillText(`hejsa ${name}`, longitude, latitude);   
  }
}

function createElements(name, left, top, width, height) {
    let canvas = document.getElementById("myCanvas")
    let context = canvas.getContext("2d");
    context.fillStyle = "black";
    context.fillRect(left, top, width, height);
    context.fillStyle = "white";
    context.font = "10px Arial";
    context.fillText(`hejsa ${name}`, left, top + 10);   
}



let elements = []

function clickCanvas(event, elemLeft, elemTop){
  let x = event.pageX - elemLeft
  let y = event.pageY - elemTop;
  let canvas = document.getElementById("myCanvas")
  ctx = canvas.getContext('2d')
  elements.forEach(function(element) {
    console.log(y > element.top + " 1");
    console.log(y < element.top + element.height + " 2");
    console.log(y);
    console.log(element.top);
    console.log(element.height + element.top);
    if (y > element.top && y < element.top + element.height 
      && x > element.left && x < element.left + element.width)  {      // check which path
      alert(element.text);
    }
  });
}


function sortArray(distanceArray){
  distanceArray.sort((a, b) => parseFloat(b.dis) - parseFloat(a.dis))
}


function drawCanvas() {
  let canvas = document.createElement('canvas');
  let slider = document.createElement('input');
  slider.setAttribute('type', 'range');
  slider.id = "range"
  slider.setAttribute('min', '200');
  slider.setAttribute('max', '750');
  slider.setAttribute('step', '10')
  slider.oninput = getRange;
  canvas.width = '200';
  canvas.height = '200';
  canvas.style.backgroundColor = 'green';
  canvas.id = "myCanvas"
  let elemLeft = canvas.offsetLeft + canvas.clientLeft
  let elemTop = canvas.offsetTop + canvas.clientTop
  context = canvas.getContext('2d')
  canvas.addEventListener('click', function(event) {clickCanvas(event, elemLeft, elemTop)}, false);

  document.getElementById('sliderBody').appendChild(slider);
  document.getElementById('canvasBody').appendChild(canvas);
}

function getRange(e) {
  let slider = e.target;
  let map = document.getElementById('myCanvas');
  map.width = slider.value;
  map.height = slider.value;
}

function distanceMap(){
  let distancearr = []
  let map = document.getElementById("myCanvas");
  document.getElementById("distanceMap").innerHTML = ""
  for (let index = 0; index < personArr.length; index++) {
    let distance = personArr[0].lon - personArr[index].lon
    let distancemap = map.width - distance
    let distanceobj = {"dis": distancemap, "name": personArr[index].name}
    distancearr.push(distanceobj)
    document.getElementById("distanceMap").innerHTML += distancemap + " Distance on map <br>"; 
  }
  sortArray(distancearr);
  personArr = []
}

function getData() {
  let positionJson = document.getElementById("showJson")
  let positionMeter = document.getElementById("showMeter")
  let meterarr = []
  positionJson.innerHTML = ""
  fetch('/getData',
  )
  .then(response => response.json())
  .then(data => {
      data.forEach(element => {
      if (element.name == getCookie("signedIn")) {
        element.me = "this is you"
      }
      meterarr.push(data)
      positionJson.innerHTML += JSON.stringify(element) + "<br>"
    });
    positionMeter.innerHTML = measure(meterarr[0][0].latitude, meterarr[0][0].longitude, meterarr[0][1].latitude, meterarr[0][1].longitude) + " Meter"
    addToCanvas(data)
  }) 
}

function addToCanvas(data) {
  let getCanvas = document.getElementById("canvasList")
  while (getCanvas.firstChild) {
    getCanvas.removeChild(getCanvas.firstChild);
  }
  elements = []
  let top = 20
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      elements.push({
        text: element.name,
        width: 150,
        height: 20,
        top: top,
        left: 15
      });
      top += 25
    } 

 for (let index = 0; index < data.length; index++) {
  const element = data[index];
  createInCanvas(element.latitude, (element.longitude + (index * 100)), element.name, element.me);  
 }

 for (let index = 0; index < elements.length; index++) {
  const element = elements[index];
  createElements(element.text, element.left, element.top, element.width, element.height)  
 }

 distanceMap()
 personArr = []
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


function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
  let R = 6378.137; // Radius of earth in KM
  let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c;
  return d * 1000; // meters
}