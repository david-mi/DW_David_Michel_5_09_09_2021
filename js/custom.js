let apiTeddies = "http://localhost:3000/api/teddies";
fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{

/// AFFICHAGE DE LA PREMIERE COULEUR DISPONIBLE POUR CHAQUE PRODUIT CHOISIT
 let colorNb = 0;
 
/// ITERATION DANS LES DATAS PUIS DANS LE LOCAL STORAGE 

    for (let i = 0; i < data.length; i++){
    //   console.log(data[i])
      for (let [key, value] of Object.entries(localStorage)) {
        
/// COMPARAISONS DES ID TROUVE DANS LE LOCALSTORAGE AVEC CEUX DU DATA
// PUIS AFFICHAGE DANS LE DOM DES PRODUITS AJOUTES DANS LE LOCALSTORAGE UNIQUEMENT

        if (data[i]._id == value){

            document.querySelector('.custom__list').innerHTML += `
            <li class="custom__item">
            <h2 class="custom__item--name">${data[i].name}</h2>
            <strong class="custom__item--price">${data[i].price}€</strong>
            <a class="custom__item--link" href="${data[i].imageUrl}"><img class="custom__item--picture" src="${data[i].imageUrl}"></a>
            <span class="instruction">Veuillez choisir votre couleur</span>
            <div class="custom-choice" id="${data[i]._id}">${data[i].colors[colorNb]}</div>
            <button type="submit" class="custom-next"></button>
            <button type="submit" class="custom-previous"></button>
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




 
});