let apiTeddies = "http://localhost:3000/api/teddies";
fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{
    for (let i = 0; i < data.length; i++){
      
      for (let [key, value] of Object.entries(localStorage)) {
        // console.log(value)
        if (data[i]._id == value){
            document.querySelector('.custom__list').innerHTML += `
            <li class="custom__item">
            <h3 class="custom__item--name">${data[i].name}</h3>
            <strong class="custom__item--price">${data[i].price}€</strong>
            <a class="custom__item--link" href="${data[i].imageUrl}"><img class="custom__item--picture" src="${data[i].imageUrl}"></a>
            <div class="custom"></div>
            <button type="submit" class="custom-next">
            <button type="submit" class="custom-previous">
            </li>`
        }
    }  

    }
    
});