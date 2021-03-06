var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    body = document.getElementsByTagName('body')[0],
    layers = [],
    values = {
      speed: 0,
      altitude: 1,
      pitch: 0,
      roll: 25,
      users: ['USER1', 'USER2', 'USER3', 'USER4', 'USER5', 'USER6', 'USER7', 'USER8', 'USER9']
    },
    preRenderedText = {},
    oldData, data, i, xCache, yCache, textCache,
    BARWIDTH = 96,
    TOPHEIGHT = 30,
    FONTHEIGHT = 20,
    FONTWIDTH = 11,
    PADDING = 7.5,
    TORAD = Math.PI / 180,
    FONTSTRING = 'freemono',
    MAXSIZE = (Math.sqrt(Math.pow(canvas.height, 2) + Math.pow(canvas.width, 2)) + 1),
    rollTicks = [-60, -45, -20, -10, 10, 20, 45, 60];
    ctx.lineWidth = '2';

ctx.font = FONTHEIGHT + ' ' + FONTSTRING;
ctx.fillStyle = 'white';
setInterval(getData, canvas.dataset.pollFrequency);
function getData(){
  microAjax(canvas.dataset.pollUrl, function(d){
    oldData = data;
    data = data+1;
    data = d.split(',');
    values = {
      //Altitude,Airspeed,Roll,Pitch,USER1,USER2,USER3,USER4,USER5,USER6,USER7,USER8,USER9
      altitude: parseInt(data[0]),
      speed: parseInt(data[1]),
      roll: parseInt(data[2]),
      pitch: parseInt(data[3]),
      users: data.splice(4, data.length)
    }
  });
}
function main(){
ctx.save();
  //CENTER
  ctx.translate((canvas.width/2), ((canvas.height + TOPHEIGHT)/2));
  ctx.save()
  //CENTER ROLLED
  ctx.rotate(TORAD * values.roll);
  ctx.strokeStyle = 'white';
  ctx.fillStyle = '#ae641b';
  ctx.beginPath();
    ctx.rect((-MAXSIZE/2), (-values.pitch * 4 >= MAXSIZE/2 ? -MAXSIZE/2 : values.pitch*4), (MAXSIZE), (values.pitch*4 >= MAXSIZE/2 ? 0 : 1) * (-values.pitch*4 >= MAXSIZE/2? MAXSIZE : -values.pitch*4 + MAXSIZE/2));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.beginPath();
    upsideDownTrianglePath();
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.rect((-canvas.width/4), (-canvas.height/4), (canvas.width/2), (canvas.height/2));
  ctx.closePath();
  ctx.clip();
  ctx.beginPath();
  for(i = 0; i < 12; i++){
    xCache = (mod(values.pitch * 4 + ((i-6) * 20), 40) < 20 ? 50 : 25);
    yCache = (20 * (i - 6) + mod(values.pitch * 4, 20));
    if(xCache != 25){
      textCache = (Math.floor((values.pitch + 5 * (6 - i)) / 10) * 10).toString();
      textCache = textCache === '0' ? '' : textCache;
      ctx.drawImage(getCachedText(textCache), xCache + 3, (yCache + FONTHEIGHT/4 - FONTHEIGHT));
      ctx.drawImage(getCachedText(textCache), (-xCache - (textCache.length * FONTWIDTH) - 6), Math.round(yCache + FONTHEIGHT/4 - FONTHEIGHT));
    }
    ctx.moveTo(-xCache, yCache);
    ctx.lineTo(xCache , yCache);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = 'black';
  ctx.restore();
  //END ROTATE
  ctx.fillStyle = '#ffdc16';
  ctx.beginPath();
    drawPlane();
  ctx.closePath();
  ctx.strokeStyle = 'black';
  ctx.fill();
  ctx.stroke();
  ctx.rotate(TORAD * 90);
  ctx.fillStyle = 'white';
  ctx.beginPath();
    for(var i = 0; i < rollTicks.length; i++){
      ctx.save();
      ctx.rotate(TORAD * rollTicks[i]);
        ctx.rect(-140 - 5, -2, 15, 4);
      ctx.restore();
    }
    trianglePath();
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  ctx.restore();
  //END CENTER
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = '2';
  ctx.beginPath();
    ctx.rect(0, 0, canvas.width, TOPHEIGHT + (ctx.lineWidth/2));
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.beginPath();
    ctx.rect(PADDING, PADDING + TOPHEIGHT, BARWIDTH, TOPHEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
    ctx.rect(PADDING, canvas.height - PADDING - TOPHEIGHT , BARWIDTH, TOPHEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
    ctx.rect(PADDING, PADDING + TOPHEIGHT * 2, BARWIDTH, canvas.height - PADDING * 2 - TOPHEIGHT * 3);
  ctx.closePath();
  ctx.globalAlpha = '0.5'
  ctx.fill();
  ctx.globalAlpha = '1';
  ctx.stroke();
  ctx.clip();
  ctx.fillStyle = 'white';
  ctx.translate(PADDING + BARWIDTH, ((canvas.height + TOPHEIGHT)/2));
  ctx.beginPath();
  for(i = 0; i < 16; i++){
      yCache = Math.round(25 * (i - 8) + mod(values.speed * 5, 25));
      xCache = (mod(values.speed * 5 + (25 * (i - 8)), 50) < 25 ? -12 : -6);
      ctx.moveTo(xCache, yCache);
      ctx.lineTo(0, yCache);
      if(xCache != -6){
        textCache = (Math.floor((values.speed + 5 * (8 - i)) / 10) * 10).toString();
        ctx.drawImage(getCachedText(textCache), 0 - 12 - 6 - textCache.length * FONTWIDTH, Math.round(yCache + FONTHEIGHT/4 - FONTHEIGHT));
      }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
    tickLabel(true);
  ctx.closePath();
  ctx.fillStyle='black';
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'white';
  textCache = (values.speed).toString();
  ctx.fillText(textCache, -FONTWIDTH * textCache.length - 12 - 6, Math.round(FONTHEIGHT/4 + 2));
  ctx.restore();
  ctx.save();
  ctx.beginPath();
    ctx.rect(canvas.width - PADDING - BARWIDTH, PADDING + TOPHEIGHT, BARWIDTH, TOPHEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
    ctx.rect(canvas.width - PADDING - BARWIDTH, canvas.height - PADDING - TOPHEIGHT , BARWIDTH, TOPHEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
    ctx.rect(canvas.width - PADDING - BARWIDTH, PADDING + TOPHEIGHT * 2, BARWIDTH, canvas.height - PADDING * 2 - TOPHEIGHT * 3);
  ctx.closePath();
  ctx.globalAlpha = '0.5';
  ctx.fill();
  ctx.globalAlpha = '1';
  ctx.stroke();
  ctx.clip();
  ctx.translate(canvas.width - PADDING - BARWIDTH, ((canvas.height + TOPHEIGHT)/2));
  ctx.fillStyle = 'white';
  ctx.beginPath();
  for(i = 0; i < 16; i++){
    yCache = Math.round(25 * (i - 8) + mod(values.altitude / 4, 25));
    xCache = mod(Math.floor(values.altitude / 4) + (25 * (i - 8)), 50) >= 25 ? 6 : 12;
    ctx.moveTo(xCache, yCache);
    ctx.lineTo(0, yCache);
    if(xCache != 6){
      textCache = (Math.floor((values.altitude - mod(values.altitude / 4, 25) / 25 * 50 + 100 * (8 - i)) / 200) * 200);
      ctx.drawImage(getCachedText(textCache), 0 + 12 + 3, (yCache + FONTHEIGHT/4 - FONTHEIGHT));
    }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
    tickLabel();
  ctx.closePath();
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'white';
  ctx.fillText(values.altitude, 12 + 3 + FONTWIDTH * 5 - FONTWIDTH * (values.altitude).toString().length, Math.round(TOPHEIGHT/4));
  ctx.fillStyle = 'black';
  ctx.beginPath();
    ctx.rect(12 + 3 + FONTWIDTH * 2, (-FONTHEIGHT/2), (FONTWIDTH * 3.5), FONTHEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.clip();
  ctx.fillStyle = 'white';
  ctx.drawImage(getCachedText((values.altitude).toString().split('')[(values.altitude).toString().length - 3] || '', Math.round(FONTHEIGHT * 0.75)), (12 + 4 + FONTWIDTH * 2.1), Math.round(-FONTHEIGHT*0.75/2 - 7));
  ctx.drawImage(getCachedText('00', Math.round(FONTHEIGHT * 1.1)), 12 + 3 + FONTWIDTH * 3 , Math.round(-TOPHEIGHT + -40 + values.altitude / (50/20)%40));
  ctx.drawImage(getCachedText('50', Math.round(FONTHEIGHT * 1.1)), 12 + 3 + FONTWIDTH * 3 , Math.round(-TOPHEIGHT + -20 + values.altitude / (50/20)%40));
  ctx.drawImage(getCachedText('00', Math.round(FONTHEIGHT * 1.1)), 12 + 3 + FONTWIDTH * 3 , Math.round(-TOPHEIGHT + 0  + values.altitude / (50/20)%40));
  ctx.drawImage(getCachedText('50', Math.round(FONTHEIGHT * 1.1)), 12 + 3 + FONTWIDTH * 3 , Math.round(-TOPHEIGHT + 20 + values.altitude / (50/20)%40));
  ctx.drawImage(getCachedText('00', Math.round(FONTHEIGHT * 1.1)), 12 + 3 + FONTWIDTH * 3 , Math.round(-TOPHEIGHT + 40 + values.altitude / (50/20)%40));
  ctx.restore();
  for(i = 0; i < 5; i++){
    ctx.beginPath();
      ctx.rect((canvas.width/5 * i + canvas.width/5/2 - BARWIDTH/2), 0, BARWIDTH, TOPHEIGHT);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.drawImage(getCachedText(values.users[4+i]), (canvas.width/5 * i + canvas.width/5/2 - BARWIDTH/2 + 3), Math.round(FONTHEIGHT/4));
  }
  ctx.drawImage(getCachedText(values.users[2]), PADDING + 3, TOPHEIGHT + PADDING + 3);
  ctx.drawImage(getCachedText(values.users[3]), canvas.width - PADDING - BARWIDTH + 3, TOPHEIGHT + PADDING + 3);
  ctx.drawImage(getCachedText(values.users[1]), canvas.width - PADDING - BARWIDTH + 3, canvas.height - PADDING - TOPHEIGHT + 3);
  ctx.drawImage(getCachedText(values.users[0]), PADDING + 3, canvas.height - PADDING - TOPHEIGHT + 3);
}

function tickLabel(neg){
  if(neg){
    neg = -1;
  } else {
    neg = 1;
  }
  ctx.moveTo(0 * neg, -1);
  ctx.lineTo(11 * neg, 10);
  ctx.lineTo(11 * neg, 15);
  ctx.lineTo(81 * neg, 15);
  ctx.lineTo(81 * neg, -15);
  ctx.lineTo(11 * neg, -15);
  ctx.lineTo(11 * neg, -10);
  ctx.lineTo(2 * neg, -1);
}

function trianglePath(){
  ctx.moveTo(-135 - 10, -10);
  ctx.lineTo(-135 + 5, 0);
  ctx.lineTo(-135 - 10, 10);
  ctx.lineTo(-135 - 10, -10);
}

function upsideDownTrianglePath(){
  ctx.moveTo( -10, -130 + 10);
  ctx.lineTo(10, -130 + 10);
  ctx.lineTo(0, -130 + 0);
  ctx.lineTo(-10, -130 + 10);
}

function drawPlane(){
  ctx.moveTo(-20, 26);
  ctx.lineTo(-20, 22);
  ctx.lineTo(20, 22);
  ctx.lineTo(20, 26);
  ctx.lineTo(72, 26);
  ctx.lineTo(0, 0);
  ctx.lineTo(-72, 26);
  ctx.lineTo(-20,26);
}
values.pitch = -401;
function updateCanvas(){
  if(oldData != data){
    oldData = data;
    ctx.clearRect(0, TOPHEIGHT, canvas.width, canvas.height - TOPHEIGHT);
    main();
  }
  window.requestAnimationFrame(updateCanvas);
}

function getCachedText(string, size){
  string = string.toString() || string;
  size = size || FONTHEIGHT;
  if(Object.keys(preRenderedText).indexOf(string + size) != -1){
    return preRenderedText[string + size];
  } else {
    var cacheCanvas = document.createElement("canvas");
    cacheCanvas.width = string.length * FONTWIDTH + FONTWIDTH;
    cacheCanvas.height = FONTHEIGHT;
    var cacheCtx = cacheCanvas.getContext('2d');
    cacheCtx.font = size + ' ' + FONTSTRING;
    cacheCtx.fillStyle = 'white';
    cacheCtx.fillText(string, 0, FONTHEIGHT);
    preRenderedText[string + size] = cacheCanvas;
    return cacheCanvas;
  }
}

function mod(num, mod){
  return (num%mod + mod)%mod;
}

window.requestAnimationFrame(updateCanvas);
