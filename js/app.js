var socket = io("http://192.249.61.132/"),
speed = 0,
topSpeed = 0,
accel = 0,
topAccel = 0,
$accel = $('span.accel'),
$topAccel = $('.topaccel'),
$topSpeed = $('.topspeed'),
$speed = $('span.speed'),
$arrowAccel = $('.accel.arrow');
$arrowVel = $('.vel.arrow');
$map = $('.map');
$player = $('.player');
mapConst = 65536;
data = {position: []};
socket.on('data', function(d){
  if(d){
    data=d;
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
    $arrowAccel.css({'-webkit-transform': 'rotatey('+ -(deg[0] - 90) +'deg)' + 'rotatex('+ deg[1] +'deg)' + 'rotatez('+ (deg[2] - 90) +'deg)','height': accel +'px'});
    //$car.css({'-webkit-transform': 'rotatez('+ -(vel[0] - 90) +'deg)'})
    $arrowVel.css({'-webkit-transform': 'rotatez('+ (vel[0] - 90) +'deg)' + 'rotatex('+ vel[1] +'deg)' + 'rotatey('+ (vel[2] - 90) + 'deg)','height': speed +'px'});
  }
});

window.requestAnimationFrame(requestData);

function requestData(){
  socket.emit('data');
  $topAccel.text(topAccel);
  $topSpeed.text(topSpeed);
  $accel.text(accel);
  $speed.text(Math.floor(data.position[0]/65536) + ' ' + Math.floor(data.position[1]/65536) + ' ' + Math.floor(data.position[2]/65536));
  window.requestAnimationFrame(requestData);
};

function getDirection(accel){
  var deg = [0,0,0];
  accel.forEach(function(x, i){
    deg[i] = Math.acos(x/Math.sqrt(Math.pow(accel[0], 2) + Math.pow(accel[1], 2) + Math.pow(accel[2], 2))) * 180 / Math.PI;
  });
  return deg;
}
