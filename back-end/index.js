var honderdste = 0;
var seconden = 0;
var minuten = 0;
var uren = 0;

//timer
setInterval(function() {
    honderdste++;
    if (honderdste == 100){ 
        seconden++;
        honderdste = 0;
    }else if (seconden == 60){
        minuten++;
        seconden = 0;
    }else if (minuten == 60){
        uren++;
        minuten = 0;
    }
    geeftDoor(uren,minuten,seconden,honderdste);
}, 10);

function geeftDoor(u, m, s, h) {
    console.log(u, m, s, h);
}


