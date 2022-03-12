async function generarLibros(){
    try{
        let f = await fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=U5XodN0WD6AxEelHTmcyeksK5nC8On22`);
        let listado = f.json();
        return listado
    }
    catch(error){
        console.error(error);
    }
}
generarLibros().then(function tratarLibros(listado) {
    let categorias = listado.results;

    categorias.forEach(function (categoria){
            let h3 = document.createElement("h3");
            let p = document.createElement("p");
            let p2 = document.createElement("p");
            let p3 = document.createElement("p");
            let btn = document.createElement("button");
            let categories = document.createElement("div");
            let dash = document.getElementById("dashboard");
            categories.append(h3,p,p2,p3,btn);
            dash.appendChild(categories);

            h3.innerHTML = categoria.display_name;
            p.innerHTML = categoria.oldest_published_date;
            p2.innerHTML = categoria.newest_published_date;
            p3.innerHTML = categoria.updated;
            btn.innerHTML = "READ MORE!";
    });    
});
