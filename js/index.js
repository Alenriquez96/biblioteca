const env = require("dotenv").config('../.env');
const apikey = process.env.apikey;

const firebaseConfig = {
    apiKey: apikey,
    authDomain: "biblioteca-f4692.firebaseapp.com",
    projectId: "biblioteca-f4692",
    storageBucket: "biblioteca-f4692.appspot.com",
    messagingSenderId: "429560808698",
    appId: "1:429560808698:web:585d74f5f44e1b779a3543"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();// db representa mi BBDD
const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};
//PASOS PARA QUE SALGA EL LOG CON GOOGLE
let provider = new firebase.auth.GoogleAuthProvider();
//coleccion users
const ref = db.collection('users').doc();

firebase.auth().languageCode = 'es';

async function login (){
    try{
        const response = await firebase.auth().signInWithPopup(provider);
        if (response.user) {
            document.getElementById("logout").style.display= "flex";
            document.getElementById("login").style.display= "none";

            //////-----------------PERFIL----------------------------//
            const perfil = document.getElementById("perfil");
            const profpic = document.createElement("img");
            const nombre = document.createElement("p");
            nombre.innerHTML = `Bienvenid@ ${response.additionalUserInfo.profile.given_name}`
            profpic.src = response.additionalUserInfo.profile.picture;
            profpic.id = "imgPerfil"
            perfil.append(profpic,nombre)

            ref.set({
                nombre:response.additionalUserInfo.profile.given_name,
                email: response.additionalUserInfo.profile.email,
                id:  ref.id
               })
            }
        return response.user;
    }catch(error){
        throw new Error(error);
    }
}


//LOGUEARSE CON GOOGLE
const buttonLogin = document.getElementById("login");

buttonLogin.addEventListener("click", async (e)=>{
    try{
        await login();
    } catch(error) {}
});



//--------------------FUNCIONALIDAD DE LA PÁGINA----------------------//
async function generarLibros(){
    try{
        let f = await fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=U5XodN0WD6AxEelHTmcyeksK5nC8On22`);
        let listado = await f.json();
        const loader = document.getElementsByClassName("loader")[0];
        loader.style.display="none";
        return listado
    }
    catch(error){
        console.error(error);
    }
}

//LLamamos a la función
generarLibros().then(function tratarLibros(listado) {
    let categorias = listado.results;

    
    //foreach para cada categoría 
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
            btn.classList = "botones";
            categories.classList = "divsCat";

        //-----------Checkear si hay usuario, y si hay crear boton de corazon------------//
        //
        //
        //------------------------------------------------------------------------------//
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    console.log(user);
                    const btnCorazon = document.createElement("button");
                    categories.append(btnCorazon);
                    btnCorazon.classList="heart";
                    btnCorazon.innerHTML ="Añadir a favoritos";
                    console.log(`Está en el sistema:${user.email} ${user.uid}`);
                    document.getElementById("logout").style.display="flex";

                    document.getElementsByClassName("heart")[index].addEventListener("click",favoritos);
                    function favoritos() {
                        const refFav = db.collection("favoritos").doc();

                        refFav.set({
                            id: ref.id,
                            favoritos: categoria.display_name
                        })
                    } 
                } 
                else{
                    console.log("Nadie en el sistema");
                }
            });
            
           //--------------------------- DESLOGUEARSE----------------------------------------------////
           //
           //------------------------------------------------------------------------------------//
            const signOut = () => {
                    let user = firebase.auth().currentUser;
                    firebase.auth().signOut().then(() => {
                        document.getElementById("login").style.display= "flex";
                        document.getElementById("logout").style.display= "none";
                        document.getElementsByClassName("heart")[index].style.display="none";
                        document.getElementById("perfil").remove()
                      }).catch((error) => {
                        console.log("hubo un error: "+error);
                      });
                  }
            document.getElementById("logout").addEventListener("click", signOut);


            //Hacemos un evento para que los botones muestren la categoria y los libros
            const botones = document.getElementsByClassName("botones");
            botones[index].addEventListener("click",
            async function entrarLista(){
                let f = await fetch(`https://api.nytimes.com/svc/books/v3/lists/${categoria.list_name_encoded}.json?api-key=U5XodN0WD6AxEelHTmcyeksK5nC8On22`);
                let data = await f.json();


                let results = data.results;
                dash.remove();
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  });
                  
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



                libros.forEach(function(info,index2){

                    document.getElementById("logout").addEventListener("click", signOut);
                    



                    
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

                    titulo.innerText = `#${info.rank}. ${info.title}`;
                    pWeeks.innerHTML = `<i>Weeks on list: ${info.weeks_on_list}</i>`;
                    desc.innerHTML = info.description;
                    divBtn.innerHTML = `
                    <form action="${info.amazon_product_url}">
                        <input type="submit" value="Buy it at Amazon!"/>
                    </form>`;


                    //Crea un boton de favoritos
                    firebase.auth().onAuthStateChanged(function(user) {
                        if (user) {

                            const btnCorazon = document.createElement("button");
                            divLibro.append(btnCorazon);
                            btnCorazon.classList="heart";
                            btnCorazon.innerHTML = "Añadir a favoritos"
                            document.getElementsByClassName("heart")[index2].addEventListener("click",favoritos);
                            function favoritos() {
                                const refFavBook = db.collection("LibrosFav").doc();
                                refFavBook.set({
                                    id: ref.id,
                                    LibrosFav: info.title
                                })
                            } 
                        } 
                        else{
                            console.log("Nadie en el sistema");
                        }
                    });
                })
            });
    });     
});
