fetch(apiTeddies)
  .then(response => {
    return response.json();
  })
  .then(data => {
    const list = document.querySelector('.products__list');
    let idUrl = '';
    const changePath = (data,i) =>{
      if (urlPath !== 'http://localhost:5500') {
        idUrl = new URL(`David_Michel_5_09_09_2021/html/product.html?id=${data[i]._id}`,urlPath);
      } else {
        idUrl = new URL(`html/product.html?id=${data[i]._id}`,urlPath);
      }
    }
    ////////// AFFICHAGE DES ITEMS DE L'API DANS LE DOM //////////
    // itération dans les data
    for (let i = 0; i < data.length; i++) {
      // création d'une url vers custom contenant un id propre
      changePath(data, i);
      // affichage dans le dom des objets de l'api
      list.innerHTML += `
        <li class="list__item">
            <h2 class="list__item--name">${data[i].name}</h2>
            <span class="list__item--description">${data[i].description}</span>
            <strong class="list__item--price">${data[i].price / 100}€</strong>
            <a class="list__item--link" href="${data[i].imageUrl}">
            <img class="list__item--picture" alt="L'ourson ${data[i].name}" src="${data[i].imageUrl}"></a>
            <a href="${idUrl}"class="add-product"></a>
        </li>`;
      /* au clic sur le bouton plus l'utilisateur sera redirigé vers la page de personnalisation
        qui contiendra dans son url l'id du produit choisi*/
    }
  });

  