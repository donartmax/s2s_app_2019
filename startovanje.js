// ovde cemo startovati nasu aplikaciju sa sifrom koju korisnik upise



const dugmeZaStart = document.querySelector('.unesi-radionicu button');

// kad se klikne na start dugme, handlujemo upisani kod
// dokumentacija za addEventListener: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
dugmeZaStart.addEventListener('click', submitCode);

// referenca na firebase bazu
const baza = firebase.database();


const dugmeZaPitanje = document.querySelector('.pitanje button');

dugmeZaPitanje.addEventListener('click', posaljiPitanje);

// funkcija za slanje pitanja 
function posaljiPitanje(){
    // tekst u polju za pitanje
    const pitanje = document.querySelector('.pitanje input').value;
    console.log('pitanje je: ' + pitanje);

    // referenciramo bazu  u zavisnosti od koda radionice
    // pr: 
    // kod = 'web'
    // pristupamo referenci u bazi sa putanjom web/pitanja
    baza.ref(kod + '/pitanja').push({
        autor: randomIme, // saljemo ime autora koje smo random dobili
        poruka: pitanje, // saljemo pitanje
        vreme: firebase.database.ServerValue.TIMESTAMP // vreme servera firebase-a
    }, function (greska){ // callback funkcija nakon pokusanog slanja
        // ako greska != null onda je doslo do greske
        if(greska){
            console.error('DOSLO JE DO GRESKE');
            console.error(greska);
        }
        else {
            alert('Pitanje poslato');
            // resetujemo tekst unutar polja za pitanja
            document.querySelector('.pitanje input').value = "";
        }
    });





}

let kod;

function submitCode() {
    // console.log('kod radionice je poslat');
    // kod koji je unet u input za kod radionice 
    kod = document.querySelector('.unesi-radionicu input').value;
    console.log(kod);
    // sakrivamo element za unosenje koda radionice
    document.querySelector('.unesi-radionicu').style.display = "none";
    // dodajemo klasu glavnom delu aplikacije da bi ga prikazali
    document.querySelector('.glavni-deo').classList.add('pokrenuto');

    // podesavamo kod radionice u prikazu
    document.getElementById("radionica").textContent = kod;


    // pratimo promene u bazi i dodajemo nova pitanja
    // dokumentacija: https://firebase.google.com/docs/database/web/read-and-write

    const pitanja = baza.ref(kod + '/pitanja');


    pitanja.on('child_added', function (podaci){
        // .val() da bi pristupi samo podacima koji nam trebaju (parsira podatke)
        dodajPitanje(podaci.val());
    });

}

// generisemo html za svako pitanje i dodajemo ga na stranicu
function dodajPitanje(podaci){
    // pogledati document.createElement 
    // za datum: pravimo novi objekat Date sa vrednoscu vreme iz podataka, a zatim ga pretvaramo u string vremena
    const pitanjeHTML = `<li>${podaci.autor}: ${podaci.poruka}, ${new Date(podaci.vreme).toLocaleTimeString()}</li>`;
    
    document.querySelector('.pitanja ul').innerHTML += pitanjeHTML;

}

let randomIme = "";


function dodeliRandomIme() {
    // iskoristimo link da dobijemo random ime iz nekog treceg izvora

    // link iz kojeg dobijemo random ime
    const API_LINK = "https://namey.muffinlabs.com/name.json";

    // koristimo then kao callback funkciju nakon izvrsenja
    // neke funkcije koja traje ili ceka

    // fetch funkcija za slanje zahteva (AJAX/API pozivi i slicno)
    // fetch dokumentacija: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    fetch(API_LINK, {
            mode: 'cors',
            method: 'GET'
        })
        .then(odgovor => odgovor.json())
        .then(podaci => {
            // uzimamo prvi element zato sto nam API vraca niz
            randomIme = podaci[0];
            document.querySelector('#ime').textContent = randomIme;
            // console.log(podaci);
        }).catch(greska => {
            // alert("DOSLO JE DO GRESKE PRILIKOM DODELJIVANJA IMENA");
            console.log('Doslo je do greske');
            // console.warn('greska');
            console.error(greska);
            randomIme = "Nesrecnik";
            document.querySelector('#ime').textContent = randomIme;
        });



}

// odmah nakon ucitavanja stranice zelimo dodeliti korisniku random ime
dodeliRandomIme();