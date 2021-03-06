var likeBuddie = document.getElementsByClassName("likeBuddie");
var zoekBalk = document.getElementById('zoekBalk');
var zoekBalkInput = document.getElementById('zoekBalkInput');
var zoekBalkEnter = document.getElementById('zoekBalkEnter');
var goBack = document.getElementById('goBack');

var backOrTop;

//Alle scroll functies
function updateScroll() {

    var scrollTop = document.documentElement.scrollTop;
    var clientHeigth = document.body.clientHeight - window.innerHeight;

    //Wanneer hoogte 25 is, doe zoekbalk anim
    if(scrollTop > 25) {
        zoekBalk.classList.add('zoekBalkScroll');
    }else{
        zoekBalk.classList.remove('zoekBalkScroll');
    }

    //Wanneer de hoogte hoger is dan ..
    if(clientHeigth > window.innerHeight - 500){
        if(scrollTop < clientHeigth){
            //Zo lang de client hoogte groter is, kan de back button gebruikt worden
            backOrTop = 'back';
            goBack.classList.remove('backToTop')
        }else if(scrollTop > clientHeigth - 150) {
            //150 px vanaf de onder kant, kan je de omhoog button gebruiken
            backOrTop = 'top';
            goBack.classList.add('backToTop')
        }
    }
}

//Wat moet er met de back button gebeuren
function goBackPageOrTop(what) {
    if(what == 'top') {
        window.scrollTo(0, 0);
    }else{
        window.location.href = document.referrer;
    }
}

//Verzend buddie data naar database
function sendLikeData(e) {
    changeHeart(e);

    //Gebruik data uit de button
    var fromBuddie = this.getAttribute("data-like-from");
    var toBuddie = this.getAttribute("data-like-to");

    //Post de data naar /checkbuddie
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            console.log(xhttp.responseText);
        }
    }
    xhttp.open("POST", "/checkBuddie", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ "frombuddie": fromBuddie, "tobuddie": toBuddie}));
}

//Zet de iconen om naar het tegen overgestelde
function changeHeart(e) {
    if(e.toElement.className == 'fas fa-heart') {
        e.toElement.parentElement.innerHTML = "<i class='far fa-heart'></i>"
        playAnimHeart(e, 0);
    }else if(e.toElement.className == 'far fa-heart') {
        e.toElement.parentElement.innerHTML = "<i class='fas fa-heart'></i>"
        playAnimHeart(e, 1);
    }
}

//Bekijk welke animatie er afgespeeld moet worden
function playAnimHeart(e, what) {
    if(what == 1) {
        e.path[1].classList.add('heartAnimFull');
        e.path[1].classList.remove('heartAnimEmpty');
    }else{
        e.path[1].classList.add('heartAnimEmpty');
        e.path[1].classList.remove('heartAnimFull');
    }
}

//Zoek functie
function searchUser(e) {
    e.preventDefault();

    //Pak element dat gezocht mag worden
    var searchCheck = document.getElementsByClassName('searchTrue');
    
    //Zet de input tekst in lowerca
    var input = zoekBalkInput.value.toLowerCase(); 
    
    for (i = 0; i < searchCheck.length; i++) {  
        //Check of de input tekst ergens voor komt
        if (!searchCheck[i].innerHTML.toLowerCase().includes(input)) { 
            //Zo nee, zet het element uit
            searchCheck[i].style.display = "none"; 
        } 
        else {
            //Zo ja, zet het element aan
            searchCheck[i].style.display = "flex";         
        } 
    } 
}


//Eventlisteners
for (var i = 0; i < likeBuddie.length; i++) {
    likeBuddie[i].addEventListener('click', sendLikeData, false);
}
goBack.addEventListener('click', function() {goBackPageOrTop(backOrTop);});
document.addEventListener('scroll', updateScroll);
if(zoekBalkEnter)  {
    zoekBalkEnter.addEventListener('click', searchUser);
}

