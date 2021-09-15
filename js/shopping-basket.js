let apiTeddies = "http://localhost:3000/api/teddies";
fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{
    
//// RECUPERATION DE LA CLE BASKET DU LOCAL STORAGE ET RECONVERSION EN OBJET

let storageBasket = JSON.parse(localStorage.getItem('basket'));

storageBasketFiltered = storageBasket.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name && t.color===v.color))===i)

// console.log(storageBasketFiltered)


//////


    
    
for (let j of storageBasketFiltered){
  for (let i of data){  

    if (i._id === j.id){
        

        document.querySelector('.basket-list').innerHTML += `
        <li class="basket__item">
            <img class="basket__item--picture" src="${i.imageUrl}">
            <h2 class="basket__item--name">${i.name}</h2>
            <span class="basket__item--color">${j.color}</span>
            <strong class="basket__item--price">${i.price} €</strong>
            <label class="basket__item--quantity-label">Quantité</label>
            <input class="basket__item--quantity" id="quantity" type="number" placeholder="quantité">
            <strong class="basket__item--total">Prix Total : ${i.price}</strong>
            <button type="submit" class="delete-custom">
        </li>`
    }


    

}

}

///// CALCUL PRIX EN FONCTION DE LA QUANTITE

let inputQty = document.querySelectorAll('.basket__item--quantity');
let totalPrice = document.querySelectorAll('.basket__item--total')
let basketItemPrice = document.querySelectorAll('.basket__item--price')
const regExpPrice = /[0-9]+/; 






for (let j = 0; j < inputQty.length; j += 1){
    inputQty[j].value = 1;

    let initial = totalPrice[j].innerText.match(regExpPrice)
    

    inputQty[j].addEventListener('input', function(){
        console.log(initial)
        /// utilisation d'un regexp pour garder seulment le prix dans l'innerText et non la monnaie €
        let priceNumbers = basketItemPrice[j].innerText.match(regExpPrice)   

        /// calcul et affichage du prix total en fonction de la quantité spécifiée
        totalPrice[j].innerHTML = `Prix Total : ${this.value * initial}`
})
}


});