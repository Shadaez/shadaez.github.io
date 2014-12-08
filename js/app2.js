var $shiftup, $shiftdn, $ebrake, $steering, $gas, $brake, gp = navigator.getGamepads()[0]; 
$shiftup = $shiftdn = $ebrake = $steering = $gas = $brake = $();

setInterval(poll, 45);

function poll(){
    gpOld = gp;
    gp = navigator.getGamepads()[0];
    if(gp.timestemp > gpOld.timestamp){
        gp.axes[0] > 0 ? $steering.css({'right': (50 - gp.axes[0] * 50).toString() + '%', 'left': '0%'}) : $steering.css({'right': '50%', 'left': (gp.axes[0] * 50).toString() + '%'});
        $gas.css({'top': (100 - gp.buttons[7].value * 100).toString() + '%'});
        $brake.css({'top': (100 - gp.buttons[6].value * 100).toString() + '%'});
        down($ebrake, gp.buttons[2].pressed);
        down($shiftup, gp.buttons[5].pressed);
        down($shiftdn, gp.buttons[4].pressed);
    }
}

function down($el, bool){
    if(bool){
        $el.addClass('down');
    } else {
        $el.removeClass('down');
    }
}

$(function () {
    $shiftdn = $('.shifter .down-btn'),
    $shiftup = $('.shifter .up-btn'),
    $ebrake = $('.e-brake .button'),
    $steering = $('.steering .bar'),
    $gas = $('.gas .bar'),
    $brake = $('.brake .bar');
});