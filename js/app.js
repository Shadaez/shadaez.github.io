//if you're looking at this know it's just shitty code and will be rewritten with angular
var socket = io("http://192.249.61.132/"),
speed = 0,
topSpeed = 0,
accel = 0,
topAccel = 0,
$accel = $('span.accel'),
$topAccel = $('.topaccel'),
$topSpeed = $('.topspeed'),
$speed = $('span.speed'),
$arrowAccel = $('.accel.arrow'),
$arrowVel = $('.vel.arrow'),
$map = $('.map'),
$player = $('.player'),
$car = $('#car'),
data = {position: []},
time = Date.now(),
oldDate = time,
pos = {x: 0, y: 0},
angles = {};
socket.on('data', function(d){
  if(d){
    data = d;
    oldTime = time;
    time = Date.now();
    speed = Math.sqrt(Math.pow(d.velocity[0], 2) + Math.pow(d.velocity[1], 2) + Math.pow(d.velocity[2], 2));
    accel = Math.sqrt(Math.pow(d.acceleration[0], 2) + Math.pow(d.acceleration[1], 2) + Math.pow(d.acceleration[2], 2));
    if(speed > topSpeed){
      topSpeed = speed;
    }
    if(accel > topAccel){
      topAccel = accel;
    }
    deg = getDirection(d.acceleration);
    vel = getDirection(d.velocity);
    angles.a = (vel[1] + d.orientation[0] * 180/Math.PI) - 180;
    angles.b = 90;
    angles.c = 180 - (angles.b + angles.a);
    pos.x = pos.x || 0; pos.y = pos.y || 0;
    pos.x += (speed * Math.sin(angles.c * Math.PI / 180))/Math.sin(angles.b) * ((time - oldTime) / 1000);
    pos.y += (speed * Math.sin(angles.a * Math.PI / 180))/Math.sin(angles.b) * ((time - oldTime) / 1000);
    $car.css({'-webkit-transform': 'rotatez('+ -(180 + d.orientation[0] * 180/Math.PI) + 'deg)' + 'rotatex('+ (180 + d.orientation[1] * 180/Math.PI)  +'deg)' + 'rotatey('+ (d.orientation[2]* 180/Math.PI) + 'deg)',
    'top': (pos.x % 100 + 100)%100 + '%', 'left': (pos.y % 100 + 100)%100 + '%'});
    $arrowAccel.css({'-webkit-transform': 'rotatey('+ -(deg[0] - 90) +'deg)' + 'rotatex('+ deg[1] +'deg)' + 'rotatez('+ (deg[2] - 90) +'deg)','height': accel +'px'});
    //$car.css({'-webkit-transform': 'rotatez('+ -(vel[0] - 90) +'deg)'})
    $arrowVel.css({'-webkit-transform': 'rotatez('+ (vel[0] - 90) +'deg)' + 'rotatex('+ vel[1] +'deg)' + 'rotatey('+ (vel[2] - 90) + 'deg)','height': speed +'px'});
  }
});

window.requestAnimationFrame(requestData);

function requestData(){
  socket.emit('data');
  window.requestAnimationFrame(requestData);
};

function getDirection(accel){
  var deg = [0,0,0];
  accel.forEach(function(x, i){
    deg[i] = Math.acos(x/Math.sqrt(Math.pow(accel[0], 2) + Math.pow(accel[1], 2) + Math.pow(accel[2], 2))) * 180 / Math.PI;
  });
  return deg;
}
