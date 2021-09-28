fetch(apiTeddies)
  .then(response => {
    return response.json();
  })
  .then(data => {
    const formContainer = document.querySelector('.form__container');
    const totalPrice = document.querySelector('.total__price');
    const storageMainTitle = document.querySelector('.main-title');

    // fonction pour check si l'item basket est présent dans le localstorage ou contient quelque chose
    let storageBasketCheck = () => {
      if ((localStorage.getItem('basket') === null) |
          (localStorage.getItem('basket') === '[]') |
          (localStorage.getItem('products') === '[]')) {
        // si la condition est remplie, on retire les éléments du dom et on indique que le panier est vide
        storageMainTitle.innerText = 'Panier Vide';
        formContainer.innerHTML = '';
        totalPrice.remove();

        // clear de la clé basket du localstorage si jamais c'est un tableau vide
        localStorage.removeItem('basket');
        localStorage.removeItem('products');
      }
    };

    storageBasketCheck();

    // si la variable storageBasket est vide on exécute pas les autres fonctions
    if (storageBasket === null) {
      return false;
    }

    //// itération dans le tableau récupéré du storage
    for (let j of storageBasket) {
      /// intération dans les objets de l'API
      for (let i of data) {
        // Affichages des objets sélectionnés dans le DOM
        if (i._id === j.id) {
          document.querySelector('.basket-list').innerHTML += `
            <li class="basket__item" id="${i._id}">
                <img class="basket__item--picture" alt="L'ourson ${i.name}"src="${i.imageUrl}">
                <h2 class="basket__item--name">${i.name}</h2>
                <span class="basket__item--color">${j.color}</span>
                <label class="basket__item--quantity-label">Quantité</label>
                <input class="basket__item--quantity" id="quantity" type="number" min="1" placeholder="quantité">
                <span class="basket__item--total">Prix: <strong class="price-qty">${i.price / 100}</strong> €</span>
                <button type="submit" class="delete-basket">
            </li>`;
        }
      }
    }

    ///// calcul du prix en fonction de la quantité choisie
    const inputQty = document.querySelectorAll('.basket__item--quantity');
    const price = document.querySelectorAll('.price-qty');
    const singlePrice = document.querySelectorAll('.single-price');
    let priceTab = [];
    let priceTabCopy = [];
    /// fonction de calcul et d'affichage du prix final dans le DOM
    const priceCalc = () => {
      const stringToNumber = priceTab.map(Number);
      const totalPriceValue = stringToNumber.reduce((acc, el) => acc + el);
      totalPrice.innerText = `Prix total: ${totalPriceValue}€`;
      return totalPriceValue;
    };

    /// fonction pour envoyer les prix initiaux dans un tableau
    const initialPrice = value => {
      priceTab.push(price[value].innerText);
      // va stocker les prix initiaux dans un tableau sans les altérer
      priceTabCopy = priceTab.slice();
      priceCalc();
    };

    /// fonction pour remplacer les prix initiaux dans par les prix multipliés par la quantité choisie
    const finalPriceUpdate = (value, value2) => {
      priceTab.splice(value, 1, value2);
      priceCalc();
    };

    //// itération dans les différents inputs créés
    for (let j = 0; j < inputQty.length; j += 1) {
      inputQty[j].value = 1;

      /// affichage du prix total dans le dom
      initialPrice(j);
      /// écoute de l'input dans le champ de formulaire quantité
      inputQty[j].addEventListener('input', function () {
        /// calcul et affichage du prix total en fonction de la quantité spécifiée
        price[j].innerText = this.value * priceTabCopy[j];
        /// mise à jour du prix final dans le DOM
        finalPriceUpdate(j, price[j].innerText);
      });
    }

    ///// RETIRER DES ELEMENTS DU PANIER /////

    const basketDelBtn = document.querySelectorAll('.delete-basket');
    const basketItemCard = document.querySelectorAll('.basket__item');
    const basketItemName = document.querySelectorAll('.basket__item--name');
    const basketItemColor = document.querySelectorAll('.basket__item--color');
    let products = [];

    /* fonction permettant d'ajouter les id dans le tableau products
        en un seul exemplaire */
    const productAdd = () => {
      for (let i = 0; i < storageBasket.length; i++) {
        if (products.includes(storageBasket[i].id) === false) {
          products.push(storageBasket[i].id);
        }
      }
    };

    productAdd();
    localStorage.setItem('products', JSON.stringify(products));

    const productSplice = () => {
      for (let p = 0; p < products.length; p++) {
        let check = storageBasket.some((e) => e.id === products[p]);
        if (check === false) {
          products.splice(p, 1);
        }
      }
    };

    //// itération dans les boutons de suppression des items  ////
    for (let i = 0; i < basketDelBtn.length; i += 1) {
      /// écoute du clic sur chaque boutons de suppression
      basketDelBtn[i].addEventListener('click', () => {
        // itération dans le tableau storageBasket
        for (let j = 0; j < storageBasket.length; j += 1) {
          // si l'item sélectionné est le même que celui du tableau, suppression du dom et du tableau
          if (
            storageBasket[j].name === basketItemName[i].innerText &&
            storageBasket[j].color === basketItemColor[i].innerText
          ) {
            storageBasket.splice(j, 1);
            productAdd();
            productSplice();
            localStorage.setItem('products', JSON.stringify(products));
            localStorage.setItem('basket', JSON.stringify(storageBasket));
            basketItemCard[i].classList.add('display');
            finalPriceUpdate(i, null);
            storageBasketCheck();
          }
        }
      });
    }

    ////////////////// FORMULAIRE ////////////////////////

    const formInput = document.querySelectorAll('form input');
    const formSmall = document.querySelectorAll('form small');
    const labelInputContainer = document.querySelectorAll('form .label-input-container');
    const formEmail = document.querySelector('#mail');
    let formData = '';

    /// création de l'objet contact
    let contact = {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      email: '',
    };

    /// regexp ///
    const regexpFirstLast = new RegExp(/^[a-zA-Z\s'.-]+$/);
    const regexpAddress = new RegExp(/^[A-Za-z0-9'\.\-\s\,]+$/);
    const regexpEmail = new RegExp(
      /^((\w[^\W]+)[\.\-]?){1,}\@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    /// fonction pour appliquer les regxp et vérifier le nombre de caractères saisi
    const validText = (text, i, regexp) => {
      if (text.length < 2) {
        formSmall[i].innerText = '2 caractères minimum';
        formSmall[i].classList.add('fail');
        labelInputContainer[i].classList.remove('check');
        formInput[i].classList.add('fail-bg');
        formData = null;
        return false;
      } else if (!regexp.test(text)) {
        formSmall[i].innerText = 'Saisie incorrecte';
        formSmall[i].classList.add('fail');
        labelInputContainer[i].classList.remove('check');
        formInput[i].classList.add('fail-bg');
        formData = null;
        return false;
      } else {
        /* quand toutes les conditions sont remplies, la variable associée
        à la partie du formulaire prend la valeur de l'input */
        formSmall[i].innerText = '';
        labelInputContainer[i].classList.add('check');
        formInput[i].classList.remove('fail-bg');
        formData = text;
        return true;
      }
    };

    /// formulaire

    for (let i = 0; i < formInput.length; i += 1) {
      formInput[i].addEventListener('input', (e) => {
        if (formInput[i].id === 'firstName') {
          validText(formInput[i].value, i, regexpFirstLast);
          contact.firstName = formData;
        } else if (formInput[i].id === 'lastName') {
          validText(formInput[i].value, i, regexpFirstLast);
          contact.lastName = formData;
        } else if (formInput[i].id === 'address') {
          validText(formInput[i].value, i, regexpAddress);
          contact.address = formData;
        } else if (formInput[i].id === 'city') {
          validText(formInput[i].value, i, regexpFirstLast);
          contact.city = formData;
        } else if (formInput[i].id === 'mail') {
          validText(formInput[i].value, i, regexpEmail);
          contact.email = formData;
        }
        // console.log(contact)
      });
    }

    /* retirer le message d'avertissement au dessus du bouton envoyer quand on clique
    ailleurs que le sur bouton */
    document.body.addEventListener('click', function (e) {
      if (!e.target.classList.contains('send')) {
        submitBtnSmall.innerText = '';
      }
    });

    // fetch post pour envoyer les informations vers l'api
    postData = () => {
      fetch(apiPost, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ contact, products })
      })
      .then(response => {
        console.log(response)
        if (!response.ok){
          console.log('Requête échouée')
          submitBtnSmall.innerText = "Envoi échoué"
        }else{
          console.log('Requête réussie')
          return response.json()
        }
      })
      .then(info => {
          console.log(info);
          successPost(info);
        })
    };

    // fonction pour voir null est présent dans contact
    const formCheck = () => {
      // transfomation de l'object contact en tableau
      let contactTab = Object.values(contact);

      /// utilisation du prototype some() pour voir si contact contient des valeurs vide ou null
      let contactTabcheck = contactTab.some((e) => (e === null) | (e === ''));

      /// si c'est true, message dans le dom indiquant que le formulaire est incomplet
      if (contactTabcheck === true) {
        submitBtnSmall.innerText = 'Formulaire incomplet';
        submitBtnSmall.classList.add('fail');

        /// si c'est false, envoi des éléments à l'api et message dans le dom pour dire que c'est envoyé
      } else if (contactTabcheck === false) {
        submitBtnSmall.innerText = 'Formulaire envoyé';
        submitBtnSmall.classList.remove('fail');
        postData();
      }
    };

    const submitBtn = document.getElementById('form-submit');
    const submitBtnSmall = document.querySelector('.submit-btn-container small');

    /*fonction affichant l'id de la commande et récapitulant les infos de la commande 
    si celle-ci aboutit */
    const successPost = (info) => {
      formContainer.classList.add('display');
      document.querySelector('.custom').classList.add('display');
      storageMainTitle.innerText = 'Commande effectuée';
      document.querySelector('body').innerHTML = `
      <section class="confirm__container">
          <h1 class="main__title">Merci pour votre commande !</h1>
          <article class="confirm__personnal-infos">
            <h2 class="confirm__title">Informations personnelles</h2>
            <ul class="personnal-infos__list-container">
              <li>Nom : <b>${info.contact.firstName}</b></li>
              <li>Prénom : <b>${info.contact.lastName}</b></li>
              <li>Adresse : <b>${info.contact.address}</b></li>
              <li>Ville : <b>${info.contact.city}</b></li>
              <li>Email : <b>${info.contact.email}</b></li>
              <li>Id de commande:<br>
              <b>${info.orderId}</b></li>
            </ul>
          </article>
          <article class="confirm__basket-infos">
            <h2 class="confirm__basket">Produits commandés</h2>
            <ul class="basket-infos__list-container">
            </ul>
          </article>
          <h3></h3>
          <a class="btn-home" href="../index.html">Retourner à la page d'accueil</a>
      </section>`;
      for (let i = 0; i < basketItemCard.length; i += 1) {
        if(!basketItemCard[i].classList.contains('display')){
           document.querySelector('.basket-infos__list-container').innerHTML += `
        <li>${basketItemName[i].innerText} couleur ${basketItemColor[i].innerText} x${inputQty[i].value}</li>`;
        }
      }
      document.querySelector('.confirm__container h3').innerText = totalPrice.innerText;
      localStorage.clear();
    };

    // écoute du clic sur le bouton envoyer et application des fonctions
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      products = JSON.parse(localStorage.getItem('products'));
      formCheck();
      console.log(products);
      console.log(contact);
    });

  });

