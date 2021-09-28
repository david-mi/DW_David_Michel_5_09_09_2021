let apiTeddies = 'http://localhost:3000/api/teddies';
let apiPost = 'http://localhost:3000/api/teddies/order';

// RECUPERATION DE LA CLE BASKET DU LOCAL STORAGE ET RECONVERSION EN TABLEAU D'OBJETS
let storageBasket = JSON.parse(localStorage.getItem('basket'));
