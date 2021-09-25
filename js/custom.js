fetch(apiTeddies)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    /* on vérifie au chargement de la page si storageBasket (clé basket récupérée du localStorage) 
        est null. si oui, storageBasket devient un tableau*/
    if (storageBasket == null) {
      storageBasket = [];
    }

    /* récupération de l'id contenu dans les URL */
    let paramUrl = new URLSearchParams(window.location.search);
    let idGet = paramUrl.get('id');

    /* fonction pour vérifier si l'url de la page product contient bien un id */
    const checkEmpty = () => {
      // si aucun id est présent, on affiche un message d'avertissement dans le DOM
      if (idGet === null) {
        document.querySelector('.main-title').innerText = `Veuillez ajouter un produit via la page d'accueil`;
      }
    };

    checkEmpty();

    ///////////// AFFICHER LES ITEMS CHOISI DE L'API DANS LE DOM ////////////////////
    let tabColor = ''
    let colorNb = 0;
    const customList = document.querySelector('.custom__list');
    let chosingText = `Choisissez votre couleur de peluche et ajoutez-la au panier`;

    /// itération dans l'api
    for (let i = 0; i < data.length; i++) {
      /* comparaison des des id trouvées dans le localStorage avec les id de l'api */
      if (data[i]._id == idGet) {
        /* affichage dans le dom des produits ayant été ajouté dans le localstorage uniquement
            avec la première couleur disponible pour chaque produit */
            console.log(data[i].colors)
            tabColor = data[i].colors
        customList.innerHTML += `
            <li class="custom__item">
                <h2 class="custom__item--name">${data[i].name}</h2>
                <strong class="custom__item--price">${data[i].price}€</strong>
                <a class="custom__item--link" href="${data[i].imageUrl}"><img class="custom__item--picture" src="${data[i].imageUrl}"></a>
                <span class="instruction">${chosingText}</span>
                <div class="custom-choice" id="${data[i]._id}">${data[i].colors[colorNb]}</div>
                <button type="submit" class="custom-next"></button>
                <button type="submit" class="custom-previous"></button>
                <a class="return-home"></a>
                <button type="submit" class="add-basket"></button>
            </li>`;
      }
    }
console.log(tabColor)
    ////////////////////////////////// SELECTIONNER LA COULEUR DE SON CHOIX SELON L'OURS CHOISI /////////////////////////////

    const customChoice = document.querySelector('.custom-choice');
    const nextBtn = document.querySelector('.custom-next');
    const previousBtn = document.querySelector('.custom-previous');

    /* fonction permettant d'afficher dans le dom les instructions demandant
        de sélectionner la couleur de son choix ainsi que le reset de la couleur du message d'erreur/succès */
    const chosingTextResetClr = () => {
      itemInstruction.innerText = chosingText;
      itemInstruction.classList.remove('success', 'fail');
    };

    /* fonction permettant de parcourir les différentes couleurs disponibles suite au clic 
        du bouton suivant et de revenir au début si on a exploré toutes les possibilités*/
    const colorNbNext = obj => {
      if (colorNb < obj.colors.length - 1) {
        colorNb += 1;
      } else {
        colorNb = 0;
      }
      customChoice.innerText = obj.colors[colorNb];
    };

    /* fonction permettant de parcourir les différentes couleurs disponibles suite au clic 
        du bouton précédent et de revenir a la fin si on a exploré toutes les possibilités */
    const colorNbPrevious = obj => {
      if (colorNb > 0) {
        colorNb -= 1;
      } else {
        colorNb = obj.colors.length - 1;
      }
      customChoice.innerText = obj.colors[colorNb];
    };

    /* double boucle afin d'itérer dans les données de l'api et aussi parmi
        les boutons suivant/précédent de chaque vignette*/
    for (let obj of data) {
      if (obj._id == customChoice.id) {
        /* écoute du clic sur les boutons précédent/suivant et application des fonctions */
        nextBtn.addEventListener('click', () => {
          chosingTextResetClr();
          colorNbNext(obj);
        });

        previousBtn.addEventListener('click', () => {
          chosingTextResetClr();
          colorNbPrevious(obj);
        });
      }
    }

    const returnHome = document.querySelector('.return-home');
    const itemNames = document.querySelector('.custom__item--name');
    const headerBasket = document.querySelector('.header__list--basket');

    /////////////////////////////   AJOUT DES ITEMS AU PANIER ///////////////////////////////////////

    const addBasketBtn = document.querySelector('.add-basket');
    const itemInstruction = document.querySelector('.instruction');

    /// fonction pour afficher une instruction ou information personnalisée
    const showInstruction = text => {
      itemInstruction.innerText = `La peluche ${itemNames.innerText} en couleur ${customChoice.innerText} ${text}`;
    };

    /* fonction pour animer l'icône du panier et ajouter un message coloré
        lorsque l'ajout à échoué*/
    const basketFail = () => {
      showInstruction('est déjà présente dans le panier');
      itemInstruction.classList.add('fail');
      addBasketBtn.classList.add('basket-fail');
      setTimeout(() => {
        addBasketBtn.classList.remove('basket-fail');
      }, 400);
    };

    /* fonction pour animer l'icône du panier et ajouter un message coloré
        lorsque l'ajout à été réussi */
    const basketSucces = () => {
      showInstruction('a été ajoutée au panier');
      itemInstruction.classList.add('success');
      itemInstruction.classList.remove('fail');
      addBasketBtn.classList.remove('add-basket');
      addBasketBtn.classList.add('basket-success');
      headerBasket.classList.add('headerB-anim');
      setTimeout(() => {
        headerBasket.classList.remove('headerB-anim');
        addBasketBtn.classList.remove('basket-success');
        addBasketBtn.classList.add('add-basket');
      }, 600);
    };

    /// ajout au clic sur le bouton panier des items avec leur nom,couleur et id dans un tableau d'objets
    addBasketBtn.addEventListener('click', () => {
      let newEntry = {
        name: itemNames.innerText,
        id: customChoice.id,
        color: customChoice.innerText,
      };

      /// vérifie si l'objet qui est sur le point d'être envoyé dans le tableau existe déjà dans celui-ci
      let contain = storageBasket.some(elem => {
        return JSON.stringify(newEntry) === JSON.stringify(elem);
      });
    
      /// l'objet ne sera envoyé que si contain retourne false
      if (!contain) {
        storageBasket.push(newEntry);
        basketSucces();
      } else {
        basketFail();
      }

      /*conversion de l'objet en chaine de caractères afin de pouvoir
                l'intégrer comme valeur au localstorage sur la clé basket*/
      localStorage.setItem('basket', JSON.stringify(storageBasket));
    });

    

    /// écoute du clic sur chaque boutons de suppression
    returnHome.addEventListener('click', () => {
      let checkBasket = storageBasket.some(elem => {return elem.color === customChoice.innerText} )
      if (checkBasket === false){
        showInstruction('a déjà été supprimée du panier');
        itemInstruction.classList.add('fail');
        itemInstruction.classList.remove('success');
      }
      // itération dans le tableau storageBasket
      for (let j = 0; j < storageBasket.length; j += 1) {

       
    
        // si l'item sélectionné est le même que celui du tableau, suppression du tableau
        if (
          storageBasket[j].name === itemNames.innerText &&
          storageBasket[j].color === customChoice.innerText
        ) {
         
          storageBasket.splice(j, 1);
          showInstruction('a été supprimée du panier');
          itemInstruction.classList.remove('fail');
          itemInstruction.classList.add('success');
          localStorage.setItem('basket', JSON.stringify(storageBasket));
        }
      }
    });
  });
  
