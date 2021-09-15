let apiTeddies = "http://localhost:3000/api/teddies";
fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{

/// AFFICHAGE DE LA PREMIERE COULEUR DISPONIBLE POUR CHAQUE PRODUIT CHOISIT
 let colorNb = 0;
 let customList = document.querySelector('.custom__list');
 
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
            <span class="instruction">Veuillez choisir votre couleur</span>
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
// const nextColor = (d,j) =>{
//     if (colorNb < d.colors.length - 1){
//         colorNb += 1;
//     }
//     else{
//         colorNb = 0;
//     }
//     customChoice[j].innerText = d.colors[colorNb]
// } 

// const prevColor = (d,j) =>{
//     if (colorNb > 0){
//         colorNb -= 1;
//     }
//     else{
//         colorNb = d.colors.length - 1;
//     }
//     customChoice[j].innerText = d.colors[colorNb]
// }

/// COULEUR SUIVANTE

let nextBtn = document.querySelectorAll('.custom-next');

for (let d of data){

    for (let j = 0; j < nextBtn.length; j += 1){

        if (d._id == customChoice[j].id){
            
            nextBtn[j].addEventListener('click', () =>{
            
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
 
let addBasketBtn = document.querySelectorAll('.add-basket')
let multipleClr = 0;
let basketItems = [];

//// AJOUT AU CLIC SUR LE BOUTON PANIER DES ITEMS AVEC LEUR COULEUR DANS UN TABLEAU D'OBJETS

for (let i = 0; i < addBasketBtn.length; i++){
    // console.log(customChoice)
    
   
    addBasketBtn[i].addEventListener('click', () =>{
        basketItems.push({
            name: itemNames[i].innerText,
            id : customChoice[i].id,
            color : customChoice[i].innerText
        },)

        /*CONVERSION DE L'OBJET EN CHAINE DE CARACTERES AFIN DE POUVOIR 
        L'INTEGRER AU LOCALSTORAGE*/
        localStorage.setItem('basket', JSON.stringify(basketItems))
    })
}



});

