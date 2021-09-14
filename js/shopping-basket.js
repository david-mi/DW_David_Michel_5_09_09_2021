let apiTeddies = "http://localhost:3000/api/teddies";
fetch(apiTeddies).then((response)=>{
    return response.json();
}).then((data)=>{
    console.log(data)
});