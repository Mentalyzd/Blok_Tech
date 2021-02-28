var zoekBalk = document.getElementById('zoekBalk');
var goBack = document.getElementById('goBack');


var backOrTop;


function updateScroll() {
    var scrollTop = document.documentElement.scrollTop;
    var clientHeigth = document.body.clientHeight - window.innerHeight - 75;
    if(scrollTop > 25) {
        zoekBalk.classList.add('zoekBalkScroll');
    }else{
        zoekBalk.classList.remove('zoekBalkScroll');
    }
    //console.log(scrollTop + 'kaka ' + clientHeigth);
    if(scrollTop > clientHeigth) {
        backOrTop = 'top';
        goBack.classList.add('backToTop')
    }else{
        backOrTop = 'back';
        goBack.classList.remove('backToTop')
    }
}



function goBackPageOrTop(what) {

    if(what == 'top') {
        window.scrollTo(0, 0);
    }else{
        goBack.history.back();
    }
}

goBack.addEventListener('click', function() {goBackPageOrTop(backOrTop);});

document.addEventListener('scroll', updateScroll);


