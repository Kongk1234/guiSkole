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

function createInCanvas(lat, lon){
  let canvas = document.getElementById("myCanvas")
  let longitude = (lon* canvas.width) / 360;
  let latitude = (lat*canvas.height) / 180;
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(longitude, latitude, 20, 20);
  ctx.font = "10px Arial";
  ctx.fillText("hejsa", longitude, latitude); 
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

      if(document.contains(document.getElementById("myCanvas"))){
        document.getElementById("myCanvas").remove()
      }

      let myCanvas = document.createElement("canvas");
      myCanvas.id = "myCanvas"
      myCanvas.height = 500;
      myCanvas.width = 1000;
      document.getElementById("canvasSize").oninput = function() {
      clearCanvas(myCanvas)
        for (let index = 0; index < data.length; index++) {
          createInCanvas(data[index].latitude, data[index].longitude);       
        }
        createCanvas()
      } 
      document.getElementById("canvasBody").appendChild(myCanvas)
      for (let index = 0; index < data.length; index++) {
        createInCanvas(data[index].latitude, data[index].longitude);      
      }      
      createCanvas()
      positionJson.innerHTML += JSON.stringify(element) + "<br>"
    });
  }) 
}

function createCanvas(){
  let ctx = myCanvas.getContext("2d");
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = "#92B901";
  ctx.fillRect(0, 0, document.getElementById("canvasSize").value, document.getElementById("canvasSize").value);
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