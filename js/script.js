let apiTeddies = "http://localhost:3000/api/teddies"

/// récupérer la valeur de basket dans le localstorage puis reconversion en format tableau
let basketItemvalue = localStorage.getItem('basket')
console.log(basketItemvalue)
if (basketItemvalue === null){
    basketItems = [];
}else{
   basketItems = JSON.parse(localStorage.getItem('basket')); 
}
