fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{
    
 let formContainer = document.querySelector('.form__container')
 let totalPrice = document.querySelector('.total__price');
    
//message d'avertissement si le panier est vide
    let storageMainTitle = document.querySelector('.main-title')

// fonction pour check si l'item basket est présent dans le localstorage ou contient quelque chose
let storageBasketCheck = () =>{
    if (localStorage.getItem('basket') === null | localStorage.getItem('basket') === '[]'){

        // si la condition est remplie, on retire les éléments du dom et on indique que le panier est vide
        storageMainTitle.innerText = 'Panier Vide';
        formContainer.innerHTML = ''
        totalPrice.remove()

        // clear de la clé basket du localstorage si jamais c'est un tableau vide
        localStorage.removeItem('basket');
        return
    }
}

storageBasketCheck();    


// RECUPERATION DE LA CLE BASKET DU LOCAL STORAGE ET RECONVERSION EN OBJET
let storageBasket = JSON.parse(localStorage.getItem('basket'));

// si la variable storageBasket est vide on exécute pas les autres fonctions
if (storageBasket === null){
        return
    }

//// itération dans le tableau récupéré du storage    
for (let j of storageBasket){

/// intération dans les objets de l'API    
    for (let i of data){  

        // Affichages des objets sélectionnés dans le DOM
        if (i._id === j.id){       
            document.querySelector('.basket-list').innerHTML += `
            <li class="basket__item" id="${i._id}">
                <img class="basket__item--picture" src="${i.imageUrl}">
                <h2 class="basket__item--name">${i.name}</h2>
                <span class="basket__item--color">${j.color}</span>
                <strong class="basket__item--price"><span class="single-price">${i.price}</span>€</strong>
                <label class="basket__item--quantity-label">Quantité</label>
                <input class="basket__item--quantity" id="quantity" type="number" min="1" placeholder="quantité">
                <span class="basket__item--total">Prix: <strong class="price-qty">${i.price}</strong> €</span>
                <button type="submit" class="delete-basket">
            </li>`      
        }
    }
}

///// calcul du prix en fonction de la quantité choisie
let inputQty = document.querySelectorAll('.basket__item--quantity');
let price = document.querySelectorAll('.price-qty')
let singlePrice = document.querySelectorAll('.single-price')
const regExpPrice = /[0-9]+/; 
let priceTab = []
let result = 0


/// fonction de calcul et d'affichage du prix final dans le DOM
const priceCalc = () =>{
    const stringToNumber = priceTab.map(Number)
    let totalPriceValue = stringToNumber.reduce((acc, el) => acc + el)
    totalPrice.innerText = `Prix total: ${totalPriceValue}€`
}

/// fonction pour envoyer les prix initiaux dans un tableau
const finalPrice = (value) =>{

    priceTab.push(price[value].innerText)
    priceCalc()
}

/// fonction pour remplacer les prix initiaux dans par les prix multipliés par la quantité choisie
const finalPriceUpdate = (value, value2) =>{
    priceTab.splice(value, 1, value2)
    priceCalc()
}


//// itération dans les différents inputs créés
for (let j = 0; j < inputQty.length; j += 1){
    inputQty[j].value = 1;

/// affichage du prix total dans le dom
finalPrice(j)   
/// écoute de l'input dans le champ de formulaire quantité
    inputQty[j].addEventListener('input', function(){
        
        /// calcul et affichage du prix total en fonction de la quantité spécifiée
      price[j].innerText = this.value * singlePrice[j].innerText

      
      /// mise à jour du prix final dans le DOM
      finalPriceUpdate(j, price[j].innerText)
})
}

///// RETIRER DES ELEMENTS DU PANIER /////

let basketDelBtn = document.querySelectorAll('.delete-basket');
let basketItem = document.querySelectorAll('.basket__item');
let basketItemName = document.querySelectorAll('.basket__item--name')
let basketItemColor = document.querySelectorAll('.basket__item--color')
let product = []; 

//// itération dans les boutons de suppression des items  ////
for (let i = 0; i < basketDelBtn.length; i += 1){
    
    /// écoute du clic sur chaque boutons de suppression
    basketDelBtn[i].addEventListener('click', () =>{
       
        // itération dans le tableau storageBasket    
        for (let j = 0; j < storageBasket.length; j += 1){

            // si l'item sélectionné est le même que celui du tableau, suppression du dom et du tableau
            if (storageBasket[j].name === basketItemName[i].innerText && storageBasket[j].color === basketItemColor[i].innerText){

            storageBasket.splice(j,1)
            productAdd()
            productSplice()
            localStorage.setItem('product',JSON.stringify(product))
            // console.log(storageBasket)  
            // let storageBasketChange = storageBasket.slice();
            // console.log(storageBasketChange)
            // storageBasketChange.splice(i, 1);
            // console.log(storageBasketChange)
            localStorage.setItem('basket',JSON.stringify(storageBasket))
            basketItem[i].remove()
            finalPriceUpdate(i, null)
            storageBasketCheck()
            }
        }    
    })
}


/// AJOUT DES ID UNIQUES DANS UN TABLEAU PRODUCT ///

/* fonction permettant d'ajouter les id dans le tableau product
en un seul exemplaire */
const productAdd = () =>{

    for (let i = 0; i < storageBasket.length; i++){ 
        if (product.includes(storageBasket[i].id) === false){
            product.push(storageBasket[i].id) 
        }
    }
}

// const productAdd = (value) =>{
    
//     if (product.includes(storageBasket[value].id) === false){
//          product.push(storageBasket[value].id)
        
         
//     }
    
// }

productAdd()

const productSplice = () =>{
  
    for (let p = 0;  p < product.length; p++){
        
        let check = storageBasket.some(e => e.id === product[p])
        if (check === false){
            product.splice(p, 1)
        }
    }
}

////////////////// FORMULAIRE ////////////////////////

let formInput = document.querySelectorAll('form input')
let formSmall = document.querySelectorAll('form small')
let labelInputContainer = document.querySelectorAll('form .label-input-container')
let formEmail = document.querySelector('#mail');
let formData = ''

/// création de l'objet contact
let contact = {
    firstName: '',
    secondName: '',
    address: '',
    city: '',
    email: ''
}

/// regexp ///
const regexpFirstLast = new RegExp(/[a-zA-Z]/)
const regexpCity = new RegExp(/[A-Za-z0-9'\.\-\s\,]/)
const regexpEmail = new RegExp(/^((\w[^\W]+)[\.\-]?){1,}\@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

/// fonction pour appliquer les regxp et vérifier le nombre de caractères saisi
const validText = (text, i, regexp) =>{
    
    if( text.length < 2){
        formSmall[i].innerText = '2 caractères minimum';
        formSmall[i].classList.add('fail');
        labelInputContainer[i].classList.remove('check');
        formInput[i].classList.add('fail-bg');
    }else if (!regexp.test(text)){
        formSmall[i].innerText = 'Saisie incorrecte';
        formSmall[i].classList.add('fail');
        labelInputContainer[i].classList.remove('check');
        formInput[i].classList.add('fail-bg');
        formData = null;
        
    }else{
        formSmall[i].innerText = '';
        labelInputContainer[i].classList.add('check');
        formInput[i].classList.remove('fail-bg');
        formData = text;
        return formData
    }
}

/// formulaire

for (let i = 0; i < formInput.length; i += 1){
    formInput[i].addEventListener('input', (e) => {

        if (formInput[i].id === 'firstName'){
            validText(formInput[i].value, i, regexpFirstLast)
            contact.firstName = formData
        }else if (formInput[i].id === 'lastName'){
            validText(formInput[i].value, i, regexpFirstLast)
            contact.secondName =  formData;
            
        }else if (formInput[i].id === 'address'){
            validText(formInput[i].value, i, regexpCity)
            contact.address = formData;
        }else if(formInput[i].id === 'city'){
            validText(formInput[i].value, i, regexpCity)
            contact.city = formData;
        }else if(formInput[i].id === 'mail'){
            validText(formInput[i].value, i, regexpEmail)
            contact.email = formData; 
        }  

        console.log(contact)
        
    } )
    
}

// console.log(product)
// console.log(contact)

// envoi du tableau product et de l'objet contact

let submitBtn = document.getElementById('form-submit');

submitBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    product = JSON.parse(localStorage.getItem('product'))
    console.log(product)
    console.log(contact)
    
})



});


