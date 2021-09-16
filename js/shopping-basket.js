let apiTeddies = "http://localhost:3000/api/teddies";
fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{
    
    
//message d'avertissement si le panier est vide
    let storageMainTitle = document.querySelector('.main-title')
    if (localStorage.getItem('basket') === null){
        storageMainTitle.innerText = 'Panier Vide'
        return
    }

// RECUPERATION DE LA CLE BASKET DU LOCAL STORAGE ET RECONVERSION EN OBJET
    let storageBasket = JSON.parse(localStorage.getItem('basket'));

// Suppression des objets doublons dans le tableau    
storageBasketFiltered = storageBasket.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name && t.color===v.color))===i)
    
//// itération dans le tableau récupéré du storage    
for (let j of storageBasketFiltered){

/// intération dans les objets de l'API    
  for (let i of data){  

    // Affichages des objets sélectionnés dans le DOM
    if (i._id === j.id){
        

        document.querySelector('.basket-list').innerHTML += `
        <li class="basket__item">
            <img class="basket__item--picture" src="${i.imageUrl}">
            <h2 class="basket__item--name">${i.name}</h2>
            <span class="basket__item--color">${j.color}</span>
            <strong class="basket__item--price">${i.price} €</strong>
            <label class="basket__item--quantity-label">Quantité</label>
            <input class="basket__item--quantity" id="quantity" type="number" placeholder="quantité">
            <strong class="basket__item--total">Prix Total : ${i.price} €</strong>
            <button type="submit" class="delete-custom">
        </li>`
    }

}

}

///// calcul du prix en fonction de la quantité choisie

let inputQty = document.querySelectorAll('.basket__item--quantity');
let price = document.querySelectorAll('.basket__item--total')
let basketItemPrice = document.querySelectorAll('.basket__item--price')
const regExpPrice = /[0-9]+/; 


//// itération dans les différents inputs créés
for (let j = 0; j < inputQty.length; j += 1){
    inputQty[j].value = 1;

/// utilisation d'un regexp pour garder seulment le prix dans l'innerText et non la monnaie €
    let initialPrice = price[j].innerText.match(regExpPrice)
    
/// écoute de l'input dans le champ de formulaire quantité
    inputQty[j].addEventListener('input', function(){
        
        /// calcul et affichage du prix total en fonction de la quantité spécifiée
        price[j].innerHTML = `Prix Total : ${this.value * initialPrice} €`
})
}


});