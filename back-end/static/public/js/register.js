var registerCarousel = document.getElementById('registerCarousel');
var registerWrap = document.getElementById('registerWrap');

//Vorige btn's
var prev1 = document.getElementById('prev1');
var prev2 = document.getElementById('prev2');
var prev3 = document.getElementById('prev3');

//Verwijder css wanneer...
function prevStep(steps) {
    if(steps == 1){
        registerWrap.classList.remove('registerCarouselBio');
    }else if(steps == 2) {
        registerWrap.classList.remove('registerCarouselGym');
    }else if(steps == 3){
        registerWrap.classList.remove('registerCarouselInfo');
    }
}

//addEventListeners
prev1.addEventListener('click', function() {prevStep(1);}, false);
prev2.addEventListener('click', function() {prevStep(2);}, false);
prev3.addEventListener('click', function() {prevStep(3);}, false);


//Next btn's
var next1 = document.getElementById('next1');
var next2 = document.getElementById('next2');
var next3 = document.getElementById('next3');

//Voeg css toe wanneer...
function nextStep(steps) {
    if(steps == 1){
        registerWrap.classList.add('registerCarouselInfo');
    }else if(steps == 2) {
        registerWrap.classList.add('registerCarouselGym');
    }else if(steps == 3){
        registerWrap.classList.add('registerCarouselBio');
    }
}

//addEventListeners
next1.addEventListener('click', function() {nextStep(1);}, false);
next2.addEventListener('click', function() {nextStep(2);}, false);
next3.addEventListener('click', function() {nextStep(3);}, false);