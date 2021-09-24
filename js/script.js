let apiTeddies = 'https://ab-p5-api.herokuapp.com/api/teddies';

// / récupérer la valeur de basket dans le localstorage puis reconversion en format tableau

// RECUPERATION DE LA CLE BASKET DU LOCAL STORAGE ET RECONVERSION EN TABLEAU D'OBJETS
let storageBasket = JSON.parse(localStorage.getItem('basket'));
