// Variable indiquant si l'historique est visible ou non
let isListVisible = false;
// Variable qui contient la liste <ul> de l'historique
const list = document.getElementById("js-info-histo-list");

// Initialisation de l'historique depuis le localStorage si existant sinon sous forme de tableau vide.
const historicalTab =JSON.parse(window.localStorage.getItem("my-historic")) || [];

// Fonction permettant de générer dynamiquement un historique des actions effectuer en admin
export function listenEdition(){
    
    const historicalView = document.getElementById("js-info-title");
    const editionHistoric = document.getElementById("js-info-histo");
    const boxEdition = document.querySelector(".editionMode");
    // On écoute le click sur le mode édition, pour afficher l'historique des ajouts et suppression de travaux
    historicalView.addEventListener("click",()=>{
        if(!isListVisible){
            // On efface la liste avant l'affichage dynamique
            list.innerHTML ="";
            // Pour chaque action enregisté dans le localStorage on créer un li pour l'afficher
            for(let i = 0; i<historicalTab.length; i++){
                const projet = document.createElement("li");

                projet.innerText = historicalTab[i];
                list.appendChild(projet);
            };
            editionHistoric.style.display = "flex";
            boxEdition.style.height= "fit-content";
        }else{
            editionHistoric.style.display= "none";
            boxEdition.style.height= "59px";
        }
        isListVisible = !isListVisible;  
    });
};



// Fonction qui met à jour l'historique dans le localStorage
function updateHistoric(){
    window.localStorage.setItem("my-historic",JSON.stringify(historicalTab));
};

// Fonction qui affiche un message dans la barre d'édition pour indiquer que le projet à bien été ajouté ou supprimer de la liste de travaux
export  function showChange(replyApi){
    const titleUpdate = document.getElementById("js-info-edit");

    switch(replyApi.status){
        case 204:
            titleUpdate.innerText = "Le Projet a été supprimé avec succès";
            titleUpdate.style.color = "red";
            break;
        case 201:
            titleUpdate.innerText = "Le Projet a été ajouté avec succès"
            titleUpdate.style.color = "green";
            break;
        default:
            titleUpdate.innerText = "";
    };
};

// Fonction appelé à chaque suppresion ou ajout de projet et qui va fabriquer une trace de l'action sous forme d'historique
export function historicUpdate(project,action){

// Variable pour contenir la catégorie présente
let category;
    // En fonction de la valeur de catégorie on lui affecte la bonne dénonciation
    switch(project.categoryId){
        case "1": category = "Objets"; break;
        case "2": category = "Appartements"; break;
        case "3": category = "Hôtels & Restaurants"; break;
        default: break;
    };

    // A chaque fois qu'un ajout ou une suppresion est effectué on enregistre la date et l'heure de l'action
    const now = new Date();
    const date = now.toLocaleString('fr-FR',{
        dateStyle: "full",
        timeStyle: "short"
    })
    
    /** En fonction de l'action en présence, "supprimer" ou "ajouter" on mets à jour le tableau d'historique puis le localStorage
    Explications: Ici on utilise project.alt pour le cas d'une suppresion de projet car la réponse de l'API pour un delete ne contient pas d'information
    si ce n'est le code status. Je vais donc prendre directement l'image concerné dans la fonction binGesture du modal.js et j'obtient alors une image avec src et alt.*/
    switch(action){

        case "delete":
        historicalTab.push(`Le ${date} — Le projet ${project.alt} a été supprimé des projets`);
        break;

        case "add":
        historicalTab.push(`Le ${date} — Le projet "${project.title}" a été ajouté à la liste des projets ${category}`);
        break;

        default:
        break;
         
    };
    updateHistoric();
};


export function deleteHisto(){
    const btnDelete = document.getElementById("js-delete-histo");
    btnDelete.addEventListener("click",()=>{
        window.localStorage.removeItem("my-historic")
        historicalTab.length = 0; 
        // On efface la liste avant l'affichage dynamique
        list.innerHTML ="";
    });
};
