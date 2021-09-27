const apiTeddies = 'http://localhost:3000/api/teddies';
const apiPost = 'http://localhost:3000/api/teddies/order';
const urlPath = window.location.origin;
if (urlPath !== 'http://localhost:5500'){
    apiTeddies = 'https://ab-p5-api.herokuapp.com/api/teddies'
    apiPost = 'https://ab-p5-api.herokuapp.com/api/teddies/order';

}

// RECUPERATION DE LA CLE BASKET DU LOCAL STORAGE ET RECONVERSION EN TABLEAU D'OBJETS
let storageBasket = JSON.parse(localStorage.getItem('basket'));
