fetch(apiTeddies)
  .then(response => {
    return response.json();
  })
  .then(data => {
    const list = document.querySelector('.products__list');
    const urlPath = window.location.origin;
   
    ////////// AFFICHAGE DES ITEMS DE L'API DANS LE DOM //////////

    // itération dans les data
    for (let obj of data) {
      // création d'un paramètre URL contenant un id obj
      let idUrl = new URL(`html/product.html?id=${obj._id}`,urlPath);
      // affichage dans le dom des objets de l'api
      list.innerHTML += `
        <li class="list__item">
            <h2 class="list__item--name">${obj.name}</h2>
            <span class="list__item--description">${obj.description}</span>
            <strong class="list__item--price">${obj.price / 100}€</strong>
            <a class="list__item--link" href="${obj.imageUrl}">
            <img class="list__item--picture" alt="L'ourson ${obj.name}" src="${obj.imageUrl}"></a>
            <a href="${idUrl}"class="add-product"></a>
        </li>`;
      /* au clic sur le bouton plus l'utilisateur sera redirigé vers la page de personnalisation
        qui contiendra dans son url l'id du produit choisi */
    }
  });

  