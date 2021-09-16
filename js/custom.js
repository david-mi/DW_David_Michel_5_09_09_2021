fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{

    
    
//// changement du titre principal dans le dom si aucun item à été choisi au préalable
    const customEmpty = () =>{
        document.querySelector('.main-title').innerText =`Vous n'avez sélectionné aucun produits`; 
    } 
    
/* fonction pour vérifier la présence d'items ajoutés au localstorage pour la personnalisation
et afficher un message dans le dom si la condition est vraie */ 
    const checkEmpty = () =>{
        if (basketItemvalue !== null && localStorage.length === 1 | localStorage.length === 0){
            customEmpty();
        }
    }
    
    checkEmpty();
    
///////////// AFFICHER LES ITEMS CHOISI DE L'API DANS LE DOM ////////////////////
    
     let colorNb = 0;
     let customList = document.querySelector('.custom__list');
     let chosingText = `Choisissez votre couleur de peluche et ajoutez-la au panier`
     

/// itération dans l'api et dans les keys du localstorage
    for (let i = 0; i < data.length; i++){
    //   console.log(data[i])
      for (let [key, value] of Object.entries(localStorage)) {
        

/* comparaison des des id trouvées dans le localStorage avec les id de l'api */
        if (data[i]._id == value){

            /* affichage dans le dom des produits ayant été ajouté dans le localstorage uniquement
            avec la première couleur disponible pour chaque produit */
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

////////////////////////////////// SELECTIONNER LA COULEUR DE SON CHOIX SELON L'OURS CHOISI /////////////////////////////

let customChoice = document.querySelectorAll('.custom-choice');
let nextBtn = document.querySelectorAll('.custom-next');
let previousBtn = document.querySelectorAll('.custom-previous');

/* fonction permettant d'afficher dans le dom les instructions demandant
de sélectionner la couleur de son choix ainsi que le reset de la couleur du message d'erreur/succès */
const chosingTextResetClr = (value) =>{
    itemInstruction[value].innerText = chosingText
    itemInstruction[value].classList.remove('success', 'fail')
 }

/* fonction permettant de parcourir les différentes couleurs disponibles suite au clic 
du bouton suivant et de revenir au début si on a exploré toutes les possibilités*/

colorNbNext = (obj, value) =>{
    if (colorNb < obj.colors.length - 1){
        colorNb += 1;
    }
    else{
        colorNb = 0;
    }
    customChoice[value].innerText = obj.colors[colorNb]
}

/* fonction permettant de parcourir les différentes couleurs disponibles suite au clic 
du bouton précédent et de revenir a la fin si on a exploré toutes les possibilités */
colorNbNext = (obj, value) =>{
    if (colorNb > 0){
        colorNb -= 1;
    }
    else{
        colorNb = obj.colors.length - 1;
    }
    customChoice[value].innerText = obj.colors[colorNb]
}

/* double boucle afin d'itérer dans les données de l'api et aussi parmi
les boutons suivant/précédent de chaque vignette*/
for (let obj of data){

    for (let j = 0; j < nextBtn.length; j += 1){

        if (obj._id == customChoice[j].id){
            
            /* écoute du clic sur les boutons précédent/suivant et application des fonctions */
            nextBtn[j].addEventListener('click', () =>{
                chosingTextResetClr(j);
                colorNbNext(obj, j)
            })

            previousBtn[j].addEventListener('click', () =>{
                chosingTextResetClr(j);
                colorNbNext(obj, j)
            })
        }
    }    
}


//////////////// SUPPRESSION DES PRODUITS DU DOM ET DU LOCALSTORAGE AU CLIC SUR LA CORBEILLE //////////////////////////////

let deleteBtn = document.querySelectorAll('.delete-custom');
let lists = document.querySelectorAll('.custom__list li')
let itemNames = document.querySelectorAll('.custom__item--name');

// itération parmi les boutons de suppression
for (let i = 0; i < deleteBtn.length; i++){
    
    // suppression de la vignette du dom au clic sur le bouton
    deleteBtn[i].addEventListener('click',() =>{
    lists[i].remove()

    // itération dans le localstorage
        for (let [key, value] of Object.entries(localStorage)){
        
            /* si la l'id de l'item cliqué est le même que celui du localstorage, on supprime */
            if (customChoice[i].id == value){
            localStorage.removeItem(itemNames[i].innerText)
            }
        }

        /// changement du titre principal si tous les produits ont été enlevés
        checkEmpty();
    })
}

/////////////////////////////   AJOUT DES ITEMS AU PANIER ///////////////////////////////////////
 
let addBasketBtn = document.querySelectorAll('.add-basket');
let itemInstruction = document.querySelectorAll('.instruction');
// console.log(basketItems)

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
     
        /// l'objet ne sera envoyé que si contain retourne false

        if (!contain){
           basketItems.push(newEntry)
           basketSucces(i)
        }else{
             basketFail(i)
        }
        
        // console.log(basketItems)
        
        /*conversion de l'objet en chaine de caractères afin de pouvoir
        l'intégrer comme valeur au localstorage sur la clé basket*/ 
        localStorage.setItem('basket', JSON.stringify(basketItems))
    })
}




});

