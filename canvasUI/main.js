var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
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
    ctx.lineWidth = '2';

ctx.font = '19 freemono';
ctx.fillStyle = 'white';
function main(){
ctx.save();
  //CENTER
  ctx.translate(Math.round(canvas.width/2), Math.round((canvas.height + TOPHEIGHT)/2));
  ctx.save()
  //CENTER ROLLED
  ctx.rotate(TORAD * values.roll);
  ctx.strokeStyle = 'white';
  ctx.fillStyle = '#ae641b';
  ctx.beginPath();
    ctx.rect(Math.round(-MAXSIZE/2), Math.round(-values.pitch * 4 >= MAXSIZE/2 ? -MAXSIZE/2 : values.pitch*4), Math.round(MAXSIZE), (values.pitch*4 >= MAXSIZE/2 ? 0 : 1) * (-values.pitch*4 >= MAXSIZE/2? MAXSIZE : -values.pitch*4 + MAXSIZE/2));
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
  ctx.rect(Math.round(-canvas.width/4), Math.round(-canvas.height/4), Math.round(canvas.width/2), Math.round(canvas.height/2));
  ctx.closePath();
  ctx.clip();
  ctx.beginPath();
  for(i = 0; i < 12; i++){
    xCache = Math.round(mod(values.pitch * 4 + ((i-6) * 20), 40) < 20 ? 50 : 25);
    yCache = Math.round(20 * (i - 6) + mod(values.pitch * 4, 20));
    if(xCache != 25){
      textCache = (Math.floor((values.pitch + 5 * (6 - i)) / 10) * 10).toString();
      textCache = textCache === '0' ? '' : textCache;
      ctx.fillText(textCache, xCache, Math.round(yCache + FONTHEIGHT/4));
      ctx.fillText(textCache, Math.round(-xCache - (textCache.length * FONTWIDTH) - 3), Math.round(yCache + FONTHEIGHT/4));
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
    ctx.rect(0, 0, canvas.width, TOPHEIGHT + Math.round(ctx.lineWidth/2));
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
  ctx.translate(PADDING + BARWIDTH, Math.round((canvas.height + TOPHEIGHT)/2));
  ctx.beginPath();
  for(i = 0; i < 16; i++){
      yCache = Math.round(25 * (i - 8) + mod(values.speed * 5, 25));
      xCache = Math.round(mod(values.speed * 5 + (25 * (i - 8)), 50) < 25 ? -12 : -6);
      ctx.moveTo(xCache, yCache);
      ctx.lineTo(0, yCache);
      if(xCache != -6){
        textCache = (Math.floor((values.speed + 5 * (8 - i)) / 10) * 10).toString();
        ctx.fillText(textCache, 0 - 12 - 3 - textCache.length * FONTWIDTH, Math.round(yCache + FONTHEIGHT/4));
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
  textCache = Math.round(values.speed).toString();
  ctx.fillText(textCache, -FONTWIDTH * textCache.length - 12 - 3, Math.round(FONTHEIGHT/4 + 2));
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
  ctx.translate(canvas.width - PADDING - BARWIDTH, Math.round((canvas.height + TOPHEIGHT)/2));
  ctx.fillStyle = 'white';
  ctx.beginPath();
  for(i = 0; i < 16; i++){
    yCache = Math.round(25 * (i - 8) + mod(values.altitude / 4, 25));
    xCache = mod(Math.floor(values.altitude / 4) + (25 * (i - 8)), 50) >= 25 ? 6 : 12;
    ctx.moveTo(xCache, yCache);
    ctx.lineTo(0, yCache);
    if(xCache != 6){
      textCache = (Math.floor((values.altitude - mod(values.altitude / 4, 25) / 25 * 50 + 100 * (8 - i)) / 200) * 200);
      ctx.fillText(textCache, 0 + 12 + 3, Math.round(yCache + FONTHEIGHT/4));
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
  ctx.fillText(Math.round(values.altitude), 12 + 3 + FONTWIDTH * 5 - FONTWIDTH * Math.round(values.altitude).toString().length, Math.round(FONTHEIGHT/4 + 2));
  ctx.fillStyle = 'black';
  ctx.beginPath();
    ctx.rect(12 + 3 + FONTWIDTH * 2, Math.round(-FONTHEIGHT/2), Math.round(FONTWIDTH * 3.5), FONTHEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.clip();
  ctx.fillStyle = 'white';
  ctx.font = Math.round(FONTHEIGHT * 0.75) + ' ' + ctx.font.split(' ')[1];
  ctx.fillText(Math.round(values.altitude).toString().split('')[Math.round(values.altitude).toString().length - 3] || '', Math.round(12 + 4 + FONTWIDTH * 2.1), Math.round(FONTHEIGHT*0.75/4 + 2));
  ctx.font = Math.round(FONTHEIGHT * 1.1) + ' ' + ctx.font.split(' ')[1];
  ctx.fillText('00', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + -40 + values.altitude / (50/20)%40));
  ctx.fillText('50', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + -20 + values.altitude / (50/20)%40));
  ctx.fillText('00', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + 0  + values.altitude / (50/20)%40));
  ctx.fillText('50', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + 20 + values.altitude / (50/20)%40));
  ctx.fillText('00', 12 + 3 + FONTWIDTH * 3 , Math.round(FONTHEIGHT/4 + 2 + 40 + values.altitude / (50/20)%40));
  ctx.restore();
  for(i = 0; i < 5; i++){
    ctx.beginPath();
      ctx.rect(Math.round(canvas.width/5 * i + canvas.width/5/2 - BARWIDTH/2), 0, BARWIDTH, TOPHEIGHT);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fillText(values.users[4+i], Math.round(canvas.width/5 * i + canvas.width/5/2 - BARWIDTH/2 + 3), FONTHEIGHT + 3);
  }
  ctx.fillText(values.users[2], PADDING + 3, TOPHEIGHT + PADDING + FONTHEIGHT + 3);
  ctx.fillText(values.users[3], canvas.width - PADDING - BARWIDTH + 3, TOPHEIGHT + PADDING + FONTHEIGHT + 3);
  ctx.fillText(values.users[1], canvas.width - PADDING - BARWIDTH + 3, canvas.height - PADDING - TOPHEIGHT + FONTHEIGHT + 3);
  ctx.fillText(values.users[0], PADDING + 3, canvas.height - PADDING - TOPHEIGHT + FONTHEIGHT + 3);
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
  //if(oldData != data){
    oldData = data;
      ctx.save();
      ctx.clearRect(0, TOPHEIGHT, canvas.width, canvas.height - TOPHEIGHT);
        values.roll += 1;
        values.pitch += 1;
        values.altitude = 88888;
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
