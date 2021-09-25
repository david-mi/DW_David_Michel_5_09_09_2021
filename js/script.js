let apiTeddies = 'http://localhost:3000/api/teddies';
let apiPost = 'http://localhost:3000/api/teddies/order';
let urlPath = window.location.origin;
let idUrl = new URL(`html/custom.html?id=${data[i]._id}`,urlPath);
if (urlPath !== 'http://localhost:5500'){
    apiTeddies = 'https://ab-p5-api.herokuapp.com/api/teddies'
    apiPost = 'https://ab-p5-api.herokuapp.com/api/teddies/order';
    idUrl = new URL(`David_Michel_5_09_09_2021/html/custom.html?id=${data[i]._id}`,urlPath);
}


// / récupérer la valeur de basket dans le localstorage puis reconversion en format tableau

// RECUPERATION DE LA CLE BASKET DU LOCAL STORAGE ET RECONVERSION EN TABLEAU D'OBJETS
let storageBasket = JSON.parse(localStorage.getItem('basket'));
