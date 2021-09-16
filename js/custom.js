fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{

/// AFFICHAGE DE LA PREMIERE COULEUR DISPONIBLE POUR CHAQUE PRODUIT CHOISIT
 let colorNb = 0;
 let customList = document.querySelector('.custom__list');
 chosingText = `Choisissez votre couleur de peluche et ajoutez-la au panier`
 
//// AFFICHAGE D'UN MESSAGE SI AUCUN ITEM N'A ETE CHOISI 

const customEmpty = () =>{
   document.querySelector('.main-title').innerText =`Vous n'avez sélectionné aucun produits`; 
} 

if (localStorage.length == 0){
    customEmpty();
}


/// ITERATION DANS LES DATAS PUIS DANS LE LOCAL STORAGE 

    for (let i = 0; i < data.length; i++){
    //   console.log(data[i])
      for (let [key, value] of Object.entries(localStorage)) {
        
/// COMPARAISONS DES ID TROUVE DANS LE LOCALSTORAGE AVEC CEUX DU DATA
// PUIS AFFICHAGE DANS LE DOM DES PRODUITS AJOUTES DANS LE LOCALSTORAGE UNIQUEMENT 
// AVEC LA PREMIERE COULEUR DISPONIBLE
        
        if (data[i]._id == value){
            
            customList.innerHTML += `
            <li class="custom__item">
            <h2 class="custom__item--name">${data[i].name}</h2>
            <strong class="custom__item--price">${data[i].price}€</strong>
            <a class="custom__item--link" href="${data[i].imageUrl}"><img class="custom__item--picture" src="${data[i].imageUrl}"></a>
            <span class="instruction">${chosingText}</span>
            <div class="custom-choice" id="${data[i]._id}">${data[i].colors[colorNb]}</div>
            <button type="submit" class="custom-next"></button>
            <button type="submit" class="custom-previous"></button>
            <button type="submit" class="delete-custom"></button>
            <button type="submit" class="add-basket"></button>
            </li>`  
            
        
        }
    }
}

// / POUVOIR SELECTIONNER LA COULEUR DE SON CHOIX SELON L'OURS CHOISI

let customChoice = document.querySelectorAll('.custom-choice');


/// COULEUR SUIVANTE

let nextBtn = document.querySelectorAll('.custom-next');

for (let d of data){

    for (let j = 0; j < nextBtn.length; j += 1){

        if (d._id == customChoice[j].id){
            
            nextBtn[j].addEventListener('click', () =>{
                itemInstruction[j].innerText = chosingText
                itemInstruction[j].classList.remove('success', 'fail')
                if (colorNb < d.colors.length - 1){
                    colorNb += 1;
                }
                else{
                    colorNb = 0;
                }
                customChoice[j].innerText = d.colors[colorNb]
    
            })
        }
    }    
}

/// COULEUR PRECEDENTE

let previousBtn = document.querySelectorAll('.custom-previous');



for (let d of data){

    for (let j = 0; j < nextBtn.length; j += 1){

        if (d._id == customChoice[j].id){

        previousBtn[j].addEventListener('click', () =>{
            itemInstruction[j].innerText = chosingText
            itemInstruction[j].classList.remove('success', 'fail')
            if (colorNb > 0){
                colorNb -= 1;
            }
            else{
                colorNb = d.colors.length - 1;
            }
            customChoice[j].innerText = d.colors[colorNb]

        })
    }
    }  
}

//////////////// SUPPRESSION DES PRODUITS DU DOM ET DU LOCALSTORAGE AU CLIC SUR LA CORBEILLE
let deleteBtn = document.querySelectorAll('.delete-custom');
let lists = document.querySelectorAll('.custom__list li')
let itemNames = document.querySelectorAll('.custom__item--name');

///////// ITERATION PARMI LES BOUTONS DE SUPPRESSION
for (let i = 0; i < deleteBtn.length; i++){
    
    //// EVENEMENT AU CLIC SUR UN DES BOUTONS SUPPRIMER
    deleteBtn[i].addEventListener('click',() =>{
    lists[i].remove()

    //// ITERATION DANS LE LOCALSTORAGE
        for (let [key, value] of Object.entries(localStorage)){
        
            /// SI LA VALEUR ID DE L'ITEM CLIQUE EST LA MEME QUE CELLE DU LOCAL STORAGE ON SUPPRIME DU LOCAL STORAGE
            if (customChoice[i].id == value){
            localStorage.removeItem(itemNames[i].innerText)
            }
        }

        /// CHANGEMENT DU TITRE H1 SI TOUS LES PRODUITS ONT ETE SUPPRIMES
        if (localStorage.length == 0){
        customEmpty();
        }

    })
}

////////////   AJOUT DES ITEMS AU PANIER
 
let addBasketBtn = document.querySelectorAll('.add-basket');
let itemInstruction = document.querySelectorAll('.instruction');
console.log(basketItems)

/* fonction pour animer l'icône du panier et ajouter un message coloré
lorsque l'ajout à été réussi */

const basketFail = (value) =>{

    itemInstruction[value].innerText = `La peluche ${itemNames[value].innerText} en couleur ${customChoice[value].innerText} est déjà presente dans le panier`;
    itemInstruction[value].classList.add('fail')

    addBasketBtn[value].classList.add('basket-fail')
    setTimeout(() => {
        addBasketBtn[value].classList.remove('basket-fail')
    }, 400);
}

/* fonction pour animer l'icône du panier et ajouter un message coloré
lorsque l'ajout échoué */

const basketSucces = (value) =>{
    itemInstruction[value].innerText = `La peluche ${itemNames[value].innerText} en couleur ${customChoice[value].innerText} a été envoyée au panier`;
    itemInstruction[value].classList.add('success');

    addBasketBtn[value].classList.remove('add-basket')
    addBasketBtn[value].classList.add('basket-success')
    setTimeout(() => {
        addBasketBtn[value].classList.remove('basket-success')
        addBasketBtn[value].classList.add('add-basket')
    }, 600);
}

/// ajout au clic sur le bouton panier des items avec leur nom,couleur et id dans un tableau d'objets

for (let i = 0; i < addBasketBtn.length; i++){
   
    addBasketBtn[i].addEventListener('click', () =>{
        let newEntry = {
            name: itemNames[i].innerText,
            id : customChoice[i].id,
            color : customChoice[i].innerText
        }
        
        /// vérifie si l'objet qui est sur le point d'être envoyé dans le tableau existe déjà dans celui-ci

        contain = basketItems.some(elem =>{
            return JSON.stringify(newEntry) === JSON.stringify(elem);
        })

                
        /// l'objet ne sera envoyé que si contain return false

        if (!contain){
           basketItems.push(newEntry)
           basketSucces(i)
        }else{
             basketFail(i)
        }
        
        console.log(basketItems)
        
        /*conversion de l'objet en chaine de caractères afin de pouvoir
        l'intégrer comme valeur au localstorage sur la clé basket*/ 
        localStorage.setItem('basket', JSON.stringify(basketItems))
    })
}




});

