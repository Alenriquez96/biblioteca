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
    console.log(categorias);

    categorias.forEach(function (categoria, index){
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
            p.innerHTML = `Oldest: ${categoria.oldest_published_date}`;
            p2.innerHTML = `Newest: ${categoria.newest_published_date}`;
            p3.innerHTML = `Updated: ${categoria.updated}`;
            btn.innerHTML = "READ MORE!";
            btn.id = `btn${index}`;

            const botones = document.getElementsByTagName("button");
            botones[index].addEventListener("click",async function entrarLista(){
                let f = await fetch(`https://api.nytimes.com/svc/books/v3/lists/${categoria.list_name_encoded}.json?api-key=U5XodN0WD6AxEelHTmcyeksK5nC8On22`);
                let data = await f.json();
                let results = data.results
                console.log(results);
                dash.remove();

                const cabecera = document.createElement("h2");
                cabecera.innerHTML = categoria.display_name;
                let btnAtras = document.createElement("div");
                btnAtras.innerHTML = 
                `<form>
                    <input type="submit" value="Back to Index"/>
                </form>`;
                document.body.append(cabecera,btnAtras);
                let NuevoDash = document.createElement("section");
                NuevoDash.id = "NuevoDash";


                const libros = results.books;
                console.log(libros);

                libros.forEach(function(info){
                    let divLibro = document.createElement("div");
                    divLibro.classList = "divLibros"
                    NuevoDash.appendChild(divLibro)
                    let titulo = document.createElement("h3");
                    let portada = document.createElement("img");
                    let pWeeks = document.createElement("p");
                    let desc = document.createElement("p");
                    let divBtn = document.createElement("div");
                    
                    portada.src = info.book_image;
                    portada.classList = "portadas";
                    divLibro.append(titulo,portada,pWeeks,desc,divBtn);
                    document.body.appendChild(NuevoDash);

                    titulo.innerText = info.title;
                    pWeeks.innerHTML = `<i>Weeks on list: ${info.weeks_on_list}</i>`;
                    desc.innerHTML = info.description;
                    divBtn.innerHTML = `
                    <form action="${info.amazon_product_url}">
                        <input type="submit" value="Buy it at Amazon!"/>
                    </form>`;
                })
            });
    });     
});
