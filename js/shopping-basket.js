fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{
    
 let formContainer = document.querySelector('.form__container')
    
//message d'avertissement si le panier est vide
    let storageMainTitle = document.querySelector('.main-title')

let storageBasketCheck = () =>{
    if (localStorage.getItem('basket') === null | localStorage.getItem('basket') === '[]'){
        storageMainTitle.innerText = 'Panier Vide';
        formContainer.innerHTML = ''
        localStorage.removeItem('basket');
        return
    }
}

storageBasketCheck();    


// RECUPERATION DE LA CLE BASKET DU LOCAL STORAGE ET RECONVERSION EN OBJET
    let storageBasket = JSON.parse(localStorage.getItem('basket'));

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
        <li class="basket__item">
            <img class="basket__item--picture" src="${i.imageUrl}">
            <h2 class="basket__item--name">${i.name}</h2>
            <span class="basket__item--color">${j.color}</span>
            <strong class="basket__item--price">${i.price} €</strong>
            <label class="basket__item--quantity-label">Quantité</label>
            <input class="basket__item--quantity" id="quantity" type="number" min="1" placeholder="quantité">
            <strong class="basket__item--total">Prix Total : ${i.price} €</strong>
            <button type="submit" class="delete-basket">
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

///// RETIRER DES ELEMENTS DU PANIER /////
let basketDelBtn = document.querySelectorAll('.delete-basket');
let basketItem = document.querySelectorAll('.basket__item');
let basketItemName = document.querySelectorAll('.basket__item--name')
let basketItemColor = document.querySelectorAll('.basket__item--color')

console.log(storageBasket)

for (let i = 0; i < basketDelBtn.length; i += 1){
    
    basketDelBtn[i].addEventListener('click', () =>{
        
    for (let j = 0; j < storageBasket.length; j += 1){

        if (storageBasket[j].name === basketItemName[i].innerText && storageBasket[j].color === basketItemColor[i].innerText){

        storageBasket.splice(j,1)
        console.log(storageBasket)  
        // let storageBasketChange = storageBasket.slice();
        // console.log(storageBasketChange)
        // storageBasketChange.splice(i, 1);
        // console.log(storageBasketChange)
        localStorage.setItem('basket',JSON.stringify(storageBasket))
        basketItem[i].remove()
        storageBasketCheck()
        }
    }    
    })
}


////////////////// FORMULAIRE ////////////////////////

let formInput = document.querySelectorAll('form input')
let formSmall = document.querySelectorAll('form small')
let labelInputContainer = document.querySelectorAll('form .label-input-container')
let formEmail = document.querySelector('#mail');
let formData = ''




let contact = {
    firstName: '',
    secondName: '',
    address: '',
    city: '',
    email: ''
}



/// regexp ///
const regexpFirstLast = new RegExp(/^[a-z ,.'-]+$/i)
const regexpCity = new RegExp(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/)
const regexpEmail = new RegExp(/^([A-Za-z0-9_\-.])+@/)

const validText = (text, i, regexp) =>{
    // console.log(text.length)
    
    if (!regexp.test(text)){
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



let submitBtn = document.getElementById('form-submit');

submitBtn.addEventListener('click', (e) =>{
    e.preventDefault();
})







});


