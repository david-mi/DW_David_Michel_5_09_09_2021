fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{

    let list = document.querySelector('.products__list');
    let lists = document.querySelectorAll('.list__item');
    
    ////////// AFFICHAGE DES ITEMS DE L'API DANS LE DOM //////////

    // itération dans le localstorage
    for (let i = 0; i < data.length; i++){
        
        // affichage dans le dom des objets de l'api
        list.innerHTML += `
        <li class="list__item">
                <h2 class="list__item--name">${data[i].name}</h2>
            <span class="list__item--description">${data[i].description}</span>
            <strong class="list__item--price">${data[i].price}€</strong>
            <a class="list__item--link" href="${data[i].imageUrl}"><img class="list__item--picture" src="${data[i].imageUrl}"></a>
            <button type="submit" id="${i}"class="add-product">
        </li>`

        
        /* conservation du bouton supprimer après rechargement de la page pour les items déjà 
        présent dans le localstorage */
        for (let [key, value] of Object.entries(localStorage)) {
            
            if (value == data[i]._id){
                document.querySelectorAll('.products__list button')[i].classList.add('remove-product')
                document.querySelectorAll('.products__list button')[i].classList.remove('add-product')
        }
        }
    }  

    /// ITERATION DANS LES BOUTONS DE LA LISTE CREE SUR LE DOM ///

    let button = document.querySelectorAll('.products__list button');
    lists = document.querySelectorAll('.list__item');
    for (let j = 0; j < button.length; j++){
    
    /// TOGGLE AU CLIC DE L'AJOUT OU L'ENLEVEMENT DES PELUCHES DANS LE LOCAL STORAGE

    // let localIdGet = localStorage.getItem(data[j].name);
    const localIdDel = () => {
     localStorage.removeItem(data[j].name);   
    }
    const localIdSet = () => {
     localStorage.setItem(data[j].name, data[j]._id);   
    }
        button[j].addEventListener('click',() =>{
            button[j].classList.toggle('add-product')
            button[j].classList.toggle('remove-product')

            if (button[j].classList.contains('remove-product')){
                localIdSet();
            }else {
                localIdDel()
            }
        }) 
    }   
})

