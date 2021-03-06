var gp = function(options) {
  options = options || {};
  options = {
    fps: options.fps || 60,
    deadzone: options.deadzone || 0.01
  };
  var gamepads = navigator.getGamepads(),
  oldGamepads,
  buttonEvents,
  axisEvents,
  type = '',
  d = {
    axis: {
      use: {},
      next: [],
      any: []
    },
    button: {
      down: {},
      up: {},
      next: [],
      pressed: []
    }
  },
  events = {
    0: dupe(d),
    1: dupe(d),
    2: dupe(d),
    3: dupe(d),
    all: dupe(d)
  },
  emitted = [];
  gamepads = [gamepads[0], gamepads[1], gamepads[2], gamepads[3]];
  setInterval(function() {
    oldGamepads = [];
    gamepads.forEach(function(gamepad, index){oldGamepads.push({buttons: dupe(!!gamepad ? gamepad.buttons : []), axes: !!gamepad ? gamepad.axes : []});});
    gamepads = navigator.getGamepads();
    gamepads = [gamepads[0], gamepads[1], gamepads[2], gamepads[3]];
    gamepads.forEach(function(gamepad, x) {
      if (!!gamepad) {
        oldGamepads[x].buttons.forEach(function(oldButton, y) {
          if (oldButton.value != gamepad.buttons[y].value) {
            type = oldButton.value > gamepad.buttons[y].value ? 'up' : 'down';
            buttonEvents = events[x].button[type][y] || [];
            buttonEvents.forEach(callbacker(gamepad, 'button', y));
            if (events[x].button.next.length > 0 && type == 'down') {
              events[x].button.next.forEach(callbacker(gamepad, 'button', y));
              events[x].button.next = [];
            }
            if (events[x].button.pressed.length > 0) {
              events[x].button.pressed.forEach(callbacker(gamepad, 'button', y));
            }
          }
        });

        gamepad.axes.forEach(function(axis, y) {
          if (Math.abs(axis) > options.deadzone) {
            axisEvents = events[x].axis.use[y] || [];
            axisEvents.forEach(callbacker(gamepad, 'axis', y));
            if (events[x].axis.next.length > 0) {
              events[x].axis.next.forEach(callbacker(gamepad, 'axis', y));
            }
            if (events[x].axis.any.length > 0) {
              events[x].axis.any.forEach(callbacker(gamepad, 'axis', y));
            }
          }
        });
      }
    });
  }, 1000 / options.fps);

  function callbacker(gamepad, type, y) {
    return function(callback) {
      callback(type == 'button' ? gamepad.buttons[y].value : gamepad.axes[y], y);
    };
  }

  function dupe(d) {
    return JSON.parse(JSON.stringify(d));
  }

  return function(x) {
    if ((x <= 3 && x >= 0) || x == 'all') {
      return {
        axis: function(y) {
          return eventer(x, 'axis', y);
        },
        button: function(y) {
          return eventer(x, 'button', y);
        }
      };
    } else {
      return new Error('Please enter a gamepad number between 0-3 or "all".');
    }

    function eventer(x, type, index) {
      var list = events[x][type];
      console.log(index);
      if (index === undefined && type == 'button') {
        return {
          next: function(callback) {
            events[x].button.next.push(callback);
          },
          pressed: function(callback) {
            events[x].button.pressed.push(callback);
          }
        };
      } else if (index === undefined && type == 'axis') {
        return {
          next: function(callback) {
            events[x].axis.next.push(callback);
          },
          any: function(callback) {
            events[x].axis.any.push(callback);
          }
        };
      } else {

        return {
          on: function(e, callback) {
            e = e.toLowerCase();
            var axisEvents = ['use'],
            buttonEvents = ['down', 'up'];
            console.log(list);
            if ((type == 'axis' && axisEvents.indexOf(e) != -1) || (type == 'button' && buttonEvents.indexOf(e) != -1)) {
              list[e][index] = list[e][index] || [];
              list[e][index].push(callback);
            } else if (type == 'button' && e == 'change') {
              list.up[index] = list.up[index] || [];
              list.up[index].push(callback);
              list.down[index] = list.down[index] || [];
              list.down[index].push(callback);
            } else {
              return new Error('Event does not exist.');
            }
          },
          emit: function(e) {
            e = e.toLowerCase();
            if ((type == 'axis' && axisEvents.indexOf(e) != -1) || (type == 'button' && buttonEvents.indexOf(e) != -1)) {
              emitted.push([x, type, e, index]);
            } else {
              return new Error('Event does not exist.');
            }
          }
        };
      }
    }
  };
};
gamepad = gp(),
cube = $('.cube')[0],
hypercube = $('.cube')[1],
x = 0,
y = 0,
x2 = 0,
y2 = 0,
i = 0,
classes = ['one', 'two', 'three', 'four', 'five', 'six'];


gamepad(0).axis().any(function(val, index){
  if(index == 0){
    y += val*2;
  } else if(index == 1) {
    x += val*2;
  } else if(index == 2){
    y2 += val*2;
  } else if(index == 3){
    x2 += val*2
  }
  cube.style.webkitAnimation = cube.style.mozAnimation = cube.style.animation = 'none';
  cube.style.transform = 'rotateX('+ x +'deg) rotateY(' + y + 'deg)';
  cube.style.transition = hypercube.style.transition = 'none';
  hypercube.style.webkitAnimation = hypercube.style.mozAnimation = hypercube.style.animation = 'none';
  hypercube.style.transform = 'rotateX('+ x2 +'deg) rotateY(' + y2 + 'deg)';
});

setTimeout(function(){
   var ls = document.getElementsByClassName('loading')[0];
   ls.style.backgroundColor = 'transparent';
}, 1500)

//setInterval(function(){$('#cube')[0].className = classes[i%6]; i++},1000)


$(function(){
  var memes = [],
      clientID = "3ef6e0470dd624b",
      meme = {},
      faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
      i = 0,
      page = 0;
  function leMeme(){
    var img = new Image();
    if(memes.length < 20){
      $.ajax({headers: {"Authorization": "Client-ID " + clientID}, url: "https://api.imgur.com/3/g/memes/viral/" + page}).done(function(res){
        memes = memes.concat(res.data);
        page++;
      });
    }

    if (memes.length > 0){
      meme = memes.pop();
      if(meme.nsfw != true){
        img.onload = function(){$('.' + faces[i%6]).css({'background-image': 'url('+meme.link+')'})};
        img.src = meme.link;
        i++;
      } else {
        leMeme();
      }
    }
  }
  setInterval(leMeme, 3000);
});
