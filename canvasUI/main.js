var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    canvasbg = document.getElementById('canvasbg'),
    ctxbg = canvasbg.getContext('2d'),
    canvasrot = document.getElementById('canvasrot'),
    ctxrot = canvasrot.getContext('2d'),
    canvasspeed = document.getElementById('canvasspeed'),
    ctxspeed = canvasspeed.getContext('2d'),
    canvasalt = document.getElementById('canvasalt'),
    ctxalt = canvasalt.getContext('2d'),
    layers = [],
    values = {
      speed: 0,
      altitude: 0,
      pitch: 0,
      roll: 25,
      users: ['USER1', 'USER2', 'USER3', 'USER4', 'USER5', 'USER6', 'USER7', 'USER8', 'USER9']
    },
    oldData, data, i, xCache, yCache, textCache,
    BARWIDTH = 96,
    TOPHEIGHT = 30,
    FONTHEIGHT = 20,
    FONTWIDTH = 11,
    PADDING = 7.5,
    TORAD = Math.PI / 180,
    MAXSIZE = Math.round(Math.sqrt(Math.pow(canvas.height, 2) + Math.pow(canvas.width, 2)) + 1),
    rollTicks = [-60, -45, -20, -10, 10, 20, 45, 60];
    ctx.lineWidth = ctxbg.lineWidth = ctxrot.lineWidth = '3';
ctx.font = ctxrot.font = ctxspeed.font = ctxalt.font ='20 consolas';
ctx.fillStyle = 'white';
ctxbg.translate(Math.round(canvasbg.width/2), Math.round((canvasbg.height + TOPHEIGHT/2)/2));
ctxrot.translate(Math.round(canvasrot.width/2), Math.round((canvasrot.height + TOPHEIGHT)/2));
ctxspeed.translate(BARWIDTH, Math.round(canvasspeed.height/2));
ctxalt.translate(0, Math.round(canvasalt.height/2));
ctx.strokeStyle = ctxbg.strokeStyle = ctxspeed.strokeStyle = ctxalt.strokeStyle = 'white';
ctxspeed.fillStyle = ctxalt.fillStyle = ctxrot.fillStyle = 'white';
ctxbg.fillStyle = '#ae641b';
function main(){
  //ctx.save();
  //CENTER
  //ctx.save()
  //CENTER ROLLED
  ctx.clearRect(0, TOPHEIGHT, canvas.width, canvas.height - TOPHEIGHT);
  ctxalt.clearRect(0, -canvasalt.height/2, canvasalt.width, canvasalt.height);
  ctxspeed.clearRect(-BARWIDTH, -canvasspeed.height/2, canvasspeed.width, canvasspeed.height);
  ctxbg.clearRect(-canvasbg.width/2, -canvasbg.height/2, canvasbg.width, canvasbg.height);
  ctxrot.clearRect(-canvasrot.width/2, -canvasrot.height/2, canvasrot.width, canvasrot.height);
  ctxbg.save();
  ctxrot.save();
  ctxbg.rotate(TORAD * values.roll);
  ctxrot.rotate(TORAD * values.roll);
  ctxbg.beginPath();
  ctxbg.rect(Math.round(-MAXSIZE/4), Math.round(-values.pitch * 2 >= MAXSIZE/4 ? -MAXSIZE/4 : values.pitch*2), Math.round(MAXSIZE/2), (values.pitch*2 >= MAXSIZE/4 ? 0 : 1) * (-values.pitch*2 >= MAXSIZE/4? MAXSIZE/2 : -values.pitch*2 + MAXSIZE/4));
  ctxbg.closePath();
  ctxbg.fill();
  ctxbg.stroke();
  ctxbg.restore();
  ctxrot.fillStyle = 'white';
  ctxrot.beginPath();
    upsideDownTrianglePath(ctxrot);
  ctxrot.closePath();
  ctxrot.fill();
  ctxrot.stroke();
  ctxrot.strokeStyle = 'white';
  ctxrot.beginPath();
  ctxrot.rect(-canvas.width/4, -canvas.height/4, canvas.width/2, canvas.height/2);
  ctxrot.clip();
  ctxrot.beginPath();
  ctxrot.lineWidth = '3';
  for(i = 0; i < 12; i++){
    xCache = Math.round(mod(values.pitch * 4 + ((i-6) * 20), 40) < 20 ? 50 : 25);
    yCache = Math.round(20 * (i - 6) + mod(values.pitch * 4, 20));
    if(xCache != 25){
      textCache = (Math.floor((values.pitch + 5 * (6 - i)) / 10) * 10).toString();
      textCache = textCache === '0' ? '' : textCache;
      ctxrot.fillText(textCache, xCache, Math.round(yCache + FONTHEIGHT/4));
      ctxrot.fillText(textCache, Math.round(-xCache - (textCache.length * FONTWIDTH) - 3), Math.round(yCache + FONTHEIGHT/4));
    }
    ctxrot.moveTo(-xCache, yCache);
    ctxrot.lineTo(xCache , yCache);
  }
  ctxrot.closePath();
  ctxrot.stroke();
  ctxrot.strokeStyle = 'black';
  ctxrot.restore();
  //END ROTATE
  ctxrot.fillStyle = '#ffdc16';
  ctxrot.beginPath();
    drawPlane(ctxrot);
  ctxrot.closePath();
  ctxrot.fill();
  ctxrot.stroke();
  ctxrot.rotate(TORAD * 90);
  ctxrot.fillStyle = 'white';
  ctxrot.lineWidth = '1';
  ctxrot.beginPath();
    for(var i = 0; i < rollTicks.length; i++){
      ctxrot.rotate(TORAD * (rollTicks[i] - (rollTicks[i-1] || 0)));
        ctxrot.rect(-140 - 5, -2, 15, 4);
    }
    ctxrot.rotate(TORAD * (0 - (rollTicks[rollTicks.length-1] || 0)));
    trianglePath(ctxrot);
    ctxrot.closePath();
    ctxrot.fill();
    ctxrot.stroke();
    ctxrot.rotate(TORAD * -90);
  //END CENTER
  ctxspeed.fillStyle = 'black';
  ctxspeed.lineWidth = '6';
  ctxspeed.beginPath();
    ctxspeed.rect(-BARWIDTH, Math.round(-canvasspeed.height/2), BARWIDTH, canvasspeed.height);
  ctxspeed.closePath();
  ctxspeed.globalAlpha = '0.5'
  ctxspeed.fill();
  ctxspeed.globalAlpha = '1';
  ctxspeed.stroke();
  ctxspeed.fillStyle = 'white';
  ctxspeed.beginPath();
  ctxspeed.lineWidth = '3';
  for(i = 0; i < 16; i++){
      yCache = Math.round(25 * (i - 8) + mod(values.speed * 5, 25));
      xCache = Math.round(mod(values.speed * 5 + (25 * (i - 8)), 50) < 25 ? -12 : -6);
      ctxspeed.moveTo(xCache, yCache);
      ctxspeed.lineTo(BARWIDTH, yCache);
      if(xCache != -6){
        textCache = (Math.floor((values.speed + 5 * (8 - i)) / 10) * 10).toString();
        ctxspeed.fillText(textCache, 0 - 12 - 3 - textCache.length * FONTWIDTH, Math.round(yCache + FONTHEIGHT/4));
      }
  }
  ctxspeed.closePath();
  ctxspeed.stroke();
  ctxspeed.beginPath();
    tickLabel(true, ctxspeed);
    ctxspeed.rect(-BARWIDTH + 2, Math.round(canvasspeed.height/2 - TOPHEIGHT) + 2, BARWIDTH - 4, TOPHEIGHT - 4);
    ctxspeed.rect(-BARWIDTH + 2, Math.round(-canvasspeed.height/2) + 2, BARWIDTH - 4, TOPHEIGHT - 4);
  ctxspeed.closePath();
  ctxspeed.fillStyle = ctx.fillStyle = 'black';
  ctxspeed.fill();
  ctxspeed.stroke();
  ctxspeed.fillStyle = 'white';
  textCache = Math.round(values.speed).toString();
  ctxspeed.fillText(textCache, -FONTWIDTH * textCache.length - 12 - 3, Math.round(FONTHEIGHT/4 + 2));
  ctxalt.fillStyle = 'black';
  ctxalt.lineWidth = '6';
  ctxalt.beginPath();
    ctxalt.rect(0, Math.round(-canvasalt.height/2), canvasalt.width, canvasalt.height);
  ctxalt.closePath();
  ctxalt.globalAlpha = '0.5';
  ctxalt.fill();
  ctxalt.globalAlpha = '1';
  ctxalt.stroke();
  ctxalt.lineWidth = '3';
  ctxalt.fillStyle = 'white';
  ctxalt.beginPath();
  for(i = 0; i < 16; i++){
    yCache = Math.round(25 * (i - 8) + mod(values.altitude / 4, 25));
    xCache = mod(Math.floor(values.altitude / 4) + (25 * (i - 8)), 50) >= 25 ? 6 : 12;
    ctxalt.moveTo(xCache, yCache);
    ctxalt.lineTo(0, yCache);
    if(xCache != 6){
      textCache = (Math.floor((values.altitude - mod(values.altitude / 4, 25) / 25 * 50 + 100 * (8 - i)) / 200) * 200);
      ctxalt.fillText(textCache, 0 + 12 + 3, Math.round(yCache + FONTHEIGHT/4));
    }
  }
  ctxalt.closePath();
  ctxalt.stroke();
  ctxalt.beginPath();
    tickLabel(false, ctxalt);
    ctxalt.rect(2, Math.round(canvasalt.height/2 - TOPHEIGHT) + 2, BARWIDTH-4, TOPHEIGHT-4);
    ctxalt.rect(2, Math.round(-canvasalt.height/2) + 2, BARWIDTH-4, TOPHEIGHT-4);
  ctx.closePath();
  ctxalt.fill();
  ctxalt.lineWidth = '3';
  ctxalt.stroke();
  ctxalt.fillStyle = 'black';
  ctxalt.fill();
  ctxalt.stroke();
  ctxalt.fillStyle = 'white';
  ctxalt.fillText(Math.round(values.altitude), 12 + 3 + FONTWIDTH * 5 - FONTWIDTH * Math.round(values.altitude).toString().length, Math.round(FONTHEIGHT/4 + 2));
  ctxalt.fillStyle = 'black';
  ctxalt.save();
  ctxalt.beginPath();
    ctxalt.rect(12 + 3 + FONTWIDTH * 2, Math.round(-FONTHEIGHT/2), Math.round(FONTWIDTH * 3.5), FONTHEIGHT);
  ctxalt.closePath();
  ctxalt.fill();
  ctxalt.clip();
  ctxalt.fillStyle = 'white';
  ctxalt.font = Math.round(FONTHEIGHT * 0.75) + ' ' + ctx.font.split(' ')[1];
  ctxalt.fillText(Math.round(values.altitude).toString().split('')[Math.round(values.altitude).toString().length - 3] || '', Math.round(12 + 4 + FONTWIDTH * 2.1), Math.round(FONTHEIGHT*0.75/4 + 2));
  ctxalt.font = Math.round(FONTHEIGHT * 1.1) + ' ' + ctx.font.split(' ')[1];
  ctxalt.fillText('00', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + -40 + values.altitude / (50/20)%40));
  ctxalt.fillText('50', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + -20 + values.altitude / (50/20)%40));
  ctxalt.fillText('00', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + 0  + values.altitude / (50/20)%40));
  ctxalt.fillText('50', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + 20 + values.altitude / (50/20)%40));
  ctxalt.fillText('00', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + 40 + values.altitude / (50/20)%40));
  ctxalt.restore();
  ctx.beginPath();
  ctx.rect(0,0,canvas.width, TOPHEIGHT)
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.strokeStyle= 'white';
  for(i = 0; i < 5; i++){
    ctx.beginPath();
      ctx.rect(Math.round(canvas.width/5 * i + canvas.width/5/2 - BARWIDTH/2), 0, BARWIDTH, TOPHEIGHT);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fillText(values.users[4+i], Math.round(canvas.width/5 * i + canvas.width/5/2 - BARWIDTH/2 + 3), FONTHEIGHT + 3);
  }
  ctxalt.fillStyle = 'white';
  ctxspeed.fillText(values.users[2], 6 - BARWIDTH, Math.round(-canvasspeed.height/2) + FONTHEIGHT + 3);
  ctxalt.fillText(values.users[3], 6, Math.round(-canvasalt.height/2 + FONTHEIGHT + 3));
  ctxalt.fillText(values.users[1], 6, Math.round(canvasalt.height/2 - TOPHEIGHT + FONTHEIGHT + 3));
  ctxspeed.fillText(values.users[0], 6 - BARWIDTH, Math.round(canvasspeed.height/2) - TOPHEIGHT + FONTHEIGHT + 3);
}

function tickLabel(neg, ctx){
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

function trianglePath(ctx){
  ctx.moveTo(-135 - 10, -10);
  ctx.lineTo(-135 + 5, 0);
  ctx.lineTo(-135 - 10, 10);
  ctx.lineTo(-135 - 10, -10);
}

function upsideDownTrianglePath(ctx){
  ctx.moveTo( -10, -130 + 10);
  ctx.lineTo(10, -130 + 10);
  ctx.lineTo(0, -130 + 0);
  ctx.lineTo(-10, -130 + 10);
}

function drawPlane(ctx){
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
  //if(oldData != data){
    oldData = data;
      ctx.save();

        values.roll += 1;
        values.pitch += 2;
        values.altitude -= 5;
        values.speed = 888;
        main();
      ctx.restore();
  //}
  window.requestAnimationFrame(updateCanvas);
}

function mod(num, mod){
  return (num%mod + mod)%mod
}
window.requestAnimationFrame(updateCanvas);
