var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    bg = new Image(),
    ticks = new Image(),
    ticks2 = new Image(),
    plane = new Image(),
    layers = [],
    canvasCenterX = canvas.width / 2,
    canvasCenterY = canvas.height / 2,
    ticksPattern = 'transparent',
    ticksPattern2 = 'transparent',
    values = {
      speed: 0,
      altitude: 0,
      pitch: 0,
      roll: 0,
      users: ['USER1', 'USER2', 'USER3', 'USER4', 'USER5', 'USER6', 'USER7', 'USER8', 'USER9']
    },
    oldData, data;

    bg.src = './horizon.png';
    ticks.src = './ticks.png';
    ticks2.src = './ticks2.png';
    plane.src = './plane.png';

    ticks.onload = function(){
      ticksPattern = ctx.createPattern(ticks, 'repeat-y');
    };

    ticks2.onload = function(){
      ticksPattern2 = ctx.createPattern(ticks2, 'repeat-y');
    };

    setInterval(pollData, canvas.dataset.pollFrequency);

    layers.push(new Layer(function(canvas, ctx){
      rectHelper(-canvas.width*2, -canvas.height*4  + values.pitch * 4, canvas.width*4, canvas.height*4, '#00bae9');
      rectHelper(-canvas.width*2, 0 + values.pitch * 4, canvas.width*4 , canvas.height*4, '#ae641b');
      ctx.save();
      rectHelper(-canvas.width/4, -canvas.height/4, canvas.width/2, canvas.height/2, 'transparent');
        ctx.clip();
        ctx.drawImage(bg, -bg.width/2, -bg.height/2  + values.pitch * 4);
      ctx.restore();
      rectHelper(-canvas.width*2, -1.5 + values.pitch * 4, canvas.width * 4, 4, 'white');
    }));
    values.pitch = 40;
    values.altitude = -1800;
    values.speed = -100;
    //values.roll = -1;
    layers[0].prefunc = function(canvas, ctx){
      this.rotation = Math.PI/180 * values.roll;
    };

    layers[0].translation = [canvasCenterX , canvasCenterY + 14];

    layers.push(new Layer(function(canvas, ctx){
      ctx.lineWidth = '3';
      ctx.save();
      //roll ticks, -60 to 60; 0 10, 20, 45, 60
      var rollticks = [-60, -45, -20, -10, 10, 20, 45, 60];
      ctx.translate(canvasCenterX, canvasCenterY);
      //plane
      ctx.drawImage(plane, -plane.width/2, -this.translation[1]/2 - 4);
      ctx.rotate(Math.PI/180 * 90);
      ctx.lineWidth = '1';
        for(var i = 0; i < rollticks.length; i++){
          ctx.save();
          ctx.rotate(Math.PI/180 * rollticks[i]);
            rectHelper(-140 - 5, -2, 15, 4, 'white', 'black');
          ctx.restore();
        }
        ctx.moveTo(-135 - 10, -10);
        ctx.lineTo(-135 + 5.5, 0);
        ctx.lineTo(-135 - 10, 10);
        ctx.lineTo(-135 - 10, -10);
        ctx.rotate(Math.PI / 180 * values.roll);
        ctx.moveTo(-130 + 10.5, -10);
        ctx.lineTo(-130 + 10.5, 10);
        ctx.lineTo(-130 + 0, 0);
        ctx.lineTo(-130 + 10.5, -10);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
      ctx.restore();
      //speed
      rectHelper(6.5, 6.5, 96, canvas.height - 6.5 * 2 - this.translation[1], 'rgba(0, 0, 0, .5)', 'white');
      ctx.save();
      rectHelper(7.5, 7.5, 96 - 3, canvas.height - 6.5 * 2 - this.translation[1], 'transparent');
      ctx.clip();
        //speed ticks
        ctx.fillStyle = 'white';
        ctx.font = '20px freemono';
        var speed = Math.floor((values.speed - 1) / 10)*10 - 50,
            modSpeed = Math.round((values.speed / (10 / 48)%ticks.height + ticks.height)*2)/2%ticks.height;
            modSpeed = modSpeed === 0 ? 48 : modSpeed;
        for(var i = 0; i < 10 ;i++){
          ctx.fillText(speed + 10 * i, 3 + 96 - ticks.width - 11*(speed + 10 * i).toString().length, canvas.height - ticks.height * i + modSpeed + 7.5 - 1 + ticks.height/2);
        }
        ctx.translate(96 - 7, modSpeed - 7.5 - 1);
        rectHelper(0, -canvas.height * 5, ticks.width, canvas.height * 10, ticksPattern2);
      ctx.restore();
      ctx.save();
        ctx.translate(96 + 6.5, (canvas.height - this.translation[1])/2 + 0.5);
        ctx.beginPath();
        ctx.moveTo(-11,-1);
        ctx.lineTo(-22,10);
        ctx.lineTo(-22,15);
        ctx.lineTo(-92,15);
        ctx.lineTo(-92,-15);
        ctx.lineTo(-22, -15);
        ctx.lineTo(-22,-10);
        ctx.lineTo(-13,-1);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
      ctx.restore();
      ctx.fillStyle = 'white';
      ctx.font = '20px freemono';
      ctx.fillText(Math.floor(values.speed), 96 - ticks.width - 5 - Math.floor(values.speed).toString().length * 11, (canvas.height - this.translation[1])/2 + 0.5 + 6);
      //alt
      rectHelper(canvas.width - 96 - 6.5, 6.5, 96, canvas.height - 6.5 * 2 - this.translation[1], 'rgba(0, 0, 0, .5)', 'white');
      ctx.save();
      rectHelper(canvas.width - 96 - 8.5 + 3, 7.5, 96 - 3, canvas.height - 6.5 * 2 - this.translation[1], 'transparent');
      ctx.clip();
        //altitude ticks
        ctx.fillStyle = 'white';
        ctx.font = '20px freemono';
        var altitude = Math.floor((values.altitude - 1) / 200)*200 - 1000,
            modAlt =  Math.round((values.altitude / (200 / 48)%ticks.height + ticks.height)*2)/2%ticks.height;
            modAlt = modAlt === 0 ? 48 : modAlt;
        for(var i = 0; i < 10 ;i++){
          ctx.fillText(altitude + 200*i, canvas.width - 3 - 96 + ticks.width, canvas.height - ticks.height* i + modAlt + 7.5 - 1 + ticks.height/2);
        }
        ctx.translate(canvas.width - 96 - 8.5 + 3, modAlt - 7.5 - 1);
        rectHelper(0, -canvas.height * 5 , ticks.width, canvas.height * 10, ticksPattern);
      ctx.restore();
      ctx.save();
        ctx.translate(canvas.width - 96 - 6.5, (canvas.height - this.translation[1])/2 + 0.5);
        ctx.beginPath();
        ctx.moveTo(11,-1);
        ctx.lineTo(22,10);
        ctx.lineTo(22,15);
        ctx.lineTo(92,15);
        ctx.lineTo(92,-15);
        ctx.lineTo(22, -15);
        ctx.lineTo(22,-10);
        ctx.lineTo(13,-1);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
      ctx.restore();
      ctx.fillStyle = 'white';
      ctx.font = '20px freemono';
      ctx.fillText(Math.floor(values.altitude), canvas.width - 96 - 6.5 + ticks.width + 77 - Math.floor(values.altitude).toString().length * 11, (canvas.height - this.translation[1])/2 + 0.5 + 6);
      rectHelper(canvas.width - 6.5 - 7 - 33, (canvas.height - this.translation[1])/2 - 10, 33, 20, 'black');
      ctx.font = '16px freemono';
      ctx.fillStyle = 'white';
      var alt = Math.floor(values.altitude).toString().split('');
      ctx.fillText((alt.length > 2 ? alt[alt.length - 3] : 0), canvas.width - 96 - 5.5 + ticks.width + 44, (canvas.height - this.translation[1])/2 + 0.5 + 5);
      rectHelper(canvas.width - 6 - 7 - 24, (canvas.height - this.translation[1])/2 - 13, 25, 27, 'transparent');
      ctx.save();
      ctx.clip();
      ctx.fillStyle = 'white';
      ctx.font = '20px freemono';
      ctx.fillText('00', canvas.width - 6 - 7 - 23, (canvas.height - this.translation[1])/2 + 7 - 40 + values.altitude / (50/20)%40);
      ctx.fillText('50', canvas.width - 6 - 7 - 23, (canvas.height - this.translation[1])/2 + 7 - 20 + values.altitude / (50/20)%40);
      ctx.fillText('00', canvas.width - 6 - 7 - 23, (canvas.height - this.translation[1])/2 + 7 + 0  + values.altitude / (50/20)%40);
      ctx.fillText('50', canvas.width - 6 - 7 - 23, (canvas.height - this.translation[1])/2 + 7 + 20 + values.altitude / (50/20)%40);
      ctx.fillText('00', canvas.width - 6 - 7 - 23, (canvas.height - this.translation[1])/2 + 7 + 40 + values.altitude / (50/20)%40);
      ctx.restore();
      //users
      rectHelper(0, -this.translation[1], canvas.width, this.translation[1], 'black');
      rectHelper(6.5, 6.5, 96, 28, 'black', 'white');
      ctx.font = '20px freemono';
      ctx.fillStyle = 'white';
      ctx.fillText(values.users[2], 6.5 + 3, 6.5 + 28 - 8);
      rectHelper(canvas.width - 96 - 6.5, 6.5, 96, 28, 'black', 'white');
      ctx.fillStyle = 'white';
      ctx.fillText(values.users[3], canvas.width - 96 - 6.5 + 3, 6.5 + 28 - 8);
      rectHelper(6.5, canvas.height - 6.5 - 28 - this.translation[1], 96, 28, 'black', 'white');
      ctx.fillStyle = 'white';
      ctx.fillText(values.users[0], 6.5 + 3, canvas.height - 6.5 - 28 - this.translation[1] + 28 - 8);
      rectHelper(canvas.width - 96 - 6.5, canvas.height - 6.5 - 28 - this.translation[1], 96, 28, 'black', 'white');
      ctx.fillStyle = 'white';
      ctx.fillText(values.users[1], canvas.width - 96 - 6.5 + 3, canvas.height - 6.5 - 28 - this.translation[1] + 28 - 8);
      ctx.lineWidth = '1';
    }));

    layers[1].translation = [0, 30];

    layers.push(new Layer(function(canvas, ctx){
      ctx.lineWidth = '3';
      //users again
      ctx.font = '20px freemono';
      for(var i = 0, width = canvas.width/5; i < 5; i++){
        rectHelper(width * i + width/2 - 48, -this.translation[1] + 1, 96, 28, 'black', 'white');
        ctx.fillStyle = 'white';
        ctx.fillText(values.users[4+i], width * i + width/2 - 48 + 3, -this.translation[1] + 1 + 28 - 7);
      }
      ctx.lineWidth = '1';
    }));

  function rectHelper(locX, locY, width, height, fillStyle, strokeStyle){
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.rect(locX, locY, width, height);
    ctx.closePath();
    ctx.fill();
    if(strokeStyle){
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
      ctx.strokeStyle = '';
    }
    ctx.fillStyle = '';
  }

  function pollData(){
    microAjax(canvas.dataset.pollUrl, function(res){
      data = res.split(',');
      values = {
        altitude: values.altitude + 1,
        speed: values.speed + 1,
        roll: values.roll + 1,
        pitch: values.pitch + 1,
        users: data.splice(4, data.length)
      };
    });
  }

  function updateCanvas(){
    if(oldData != data){
      oldData = data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for(var i = 0; i < layers.length; i++){
        ctx.save();
        layers[i].update(canvas, ctx);
        ctx.restore();
      }
    }
    window.requestAnimationFrame(updateCanvas);
  }


  function Layer(func){
    this.rotation = 0;//x, y
    this.translation = [0, 0];
    this.func = func;
  }

  Layer.prototype.update = function(canvas, ctx){
    if(this.prefunc) this.prefunc(canvas, ctx);
    ctx.translate(this.translation[0], this.translation[1]);
    ctx.rotate(this.rotation);
    this.func(canvas, ctx);
    if(this.postfunc) this.postfunc(canvas, ctx);
  };
  window.requestAnimationFrame(updateCanvas);
