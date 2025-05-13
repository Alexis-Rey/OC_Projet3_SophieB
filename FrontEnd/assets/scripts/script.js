// ************************** FICHIER JS CONCERNANT LE FONCTIONNEMENT GLOBALE DU SITE  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

// Import des fonctions issus de config.js
import { recupererTravaux, recupererCategories} from "./config.js";
import { filterWorks } from "./filtre.js";
import { showModal} from "./modal.js";
 
/**
 * Initialisation des variables globales.
 * @param {string} key : la clé du localStorage
 * @param {object} works : les données des travaux
 * @param {object} categories : les données des catégories
 * @param {array} buttons : un tableau pour les boutons
 */
const key = "mes-travaux";
let works;
let categories; 
const buttons = [];


/**
 * Fonction permettant de générer notre Page d'accueil dynamiquement pour l'architecte Sophie Bluel
 * @param {array of object} works : les données des travaux issues de l'API reçu par la fonciton localOuApi
 * * @param {array of object} categories : les données des catégories issues de l'API reçu par la fonciton localOuApi
 */
function genererPage(works, categories){
    try{
    genererGallery(works); 
    genererFilter(categories);
    }catch{
        console.log("Problème dans la génération de la page: voir error console")
    };
}

// Fonction permettant de récupérer nos travaux et catégories depuis l'API ou depuis le localStorage si cette dernière n'est
// pas accessible
async function localOuApi(){
    // Récupération d'info du localStroage correpondant à la clé
    let worksStorage = window.localStorage.getItem(key);
    // Tets API
    // Appelle à la fonction de récupération des travaux de l'API, gestion de l'erreur et 
    // retourner null si jamais une erreur est survenu.
    works = await recupererTravaux().catch(e=>{ console.error(e);
        console.error("Connexion API échoué, récupération des données du cache . . . ")
        return null;
    });

    if (works) {
        // Si l'API a répondu, on enregistre et utilise ses données
        const worksValues = JSON.stringify(works);
        window.localStorage.setItem(key, worksValues);
    } else if (worksStorage !== null) {
        // Si l'API a échoué mais qu'on a quelque chose en localStorage
        works = JSON.parse(worksStorage);
    } else {
        // Rien dans l'API et rien dans le localStorage
        works = [];
        console.error("Le cache est vide, nous travaillons sur le problème, revenez vers nous dans quelques temps")
    }

    // Test API - Récupération des catégories 
    categories = await recupererCategories().catch(e=>{ console.error(e)});
    return {works, categories}; 
};



/**
 * Fonction permettant de générer notre Gallery de travaux dynamiquement pour l'architecte Sophie Bluel
 * @param {array of object} travaux : les données des travaux issues de l'API
 */
function genererGallery(travaux){
    // Récupération de l'élément DOM parent nécessaire - ici la gallery qui va contenir les travaux
    // Suppresion dans un second temps de son contenu car l'affichage se fait dynamiquement.
    const gallery =  document.querySelector(".gallery");
    gallery.innerHTML="";

    // Initialisation d'une boucle qui va parcourir l'ensemble de nos travaux un à un pour créer notre gallery 
    for( let i = 0; i < travaux.length; i++){
        // Création d'une balises figure dédié à un travail
        const figure = document.createElement("figure");

        // Création des informations de chaque travail grâce aux info issu de l'API
        const img = document.createElement("img");
        img.src = travaux[i].imageUrl;
        img.alt = travaux[i].title;

        const titre = document.createElement("figcaption")
        titre.innerText =  travaux[i].title;

        // Rattachement des éléments créer et configurer dans le DOM
        figure.appendChild(img);
        figure.appendChild(titre);
        gallery.appendChild(figure);
    };

};


/** Fonction pour générer dynamiquement les filtres et les afficher
 * @param {array of object} Filtres : les données des catégories de filtre issues de l'API
 */
function genererFilter(Filtres){

    const menuFilter = document.querySelector(".menu-filter");

    // Initialisation d'une boucle qui va parcourir l'ensemble de nos catégories un à un pour créer nos boutons filtres 
    for ( let i = 0; i < Filtres.length; i++){
        // Création d'une balise button dédié à un filtre
        const buttonCategories = document.createElement("button");
        // Création des informations de chaque catégories grâce aux données issues de l'API
        buttonCategories.dataset.id = Filtres[i].id;
        buttonCategories.innerText = Filtres[i].name
        // Ajout d'une classe pour la partie design CSS
        buttonCategories.classList = "btn-filter"

        // Ajout des boutons dans le DOM 
        menuFilter.appendChild(buttonCategories);
        //  Stockage des boutons pour un accès en dehors de la fonction en créant un tableau
        buttons.push(buttonCategories);
    };
    
};

// Première Génération de la page d'accueil du Site, on test d'abord si les données sont issus de l'API
// ou du localStorage puis on génère la page à partir de ces données
const worksEtCategories = await localOuApi();
genererPage(worksEtCategories.works, worksEtCategories.categories);


//*********** GESTION DES TRAVAUX EN FONCTION DU FILTRE sélectioné par l'utilisateur ****************************//
// On utilise ici une boucle for pour parcourir le tableau de boutons issu de la fonction genererFilter qui génère dynamiquement les catégories reçu par API
for ( let b = 0; b < buttons.length; b++){

    /**  @param {string} buttonClicked : le bouton qui est cliqué */
    /**  @param {array} worksFiltered : tableau contenant les travaux filtés issu de filtre.js suivant le choix utilisateur */
    let buttonClicked;
    const gallery =  document.querySelector(".gallery");
    let worksFiltered;

    // Ajout d'un écouter d'évènement au click sur chaque bouton
    buttons[b].addEventListener("click",(e) => { 
        // Lorsqu'un' bouton est cliqué, on affecte le data-id du bouton à la variable
        buttonClicked = buttons[b].dataset.id;
        // Gestion suivant la valeur data-id de la variable avec :
        // Cas 1 : recherche des travaux correpondant à la catégorie "Objets"
        // Cas 2 : recherche des travaux correpondant à la catégorie "Appartements"
        // Cas 3 : recherche des travaux correpondant à la catégorie "Hotels & restaurants"
        switch(buttonClicked){
            case "1": 
            worksFiltered = filterWorks(worksEtCategories.works,"Objets");
            break;
            case "2": 
            worksFiltered = filterWorks(worksEtCategories.works,"Appartements");
            break;
            case "3": 
            worksFiltered = filterWorks(worksEtCategories.works,"Hotels & restaurants");
            break;
            default: console.log("aucun appuie bouton");
            break;
        }
        // Rafraichissement de la page et nouvelle génération dynamique des travaux en fonction du choix effectuer par l'utilisateur
        gallery.innerHTML="";
        genererGallery(worksFiltered)
    });
};

// Ajout du listener sur le boutton Tous des filtres  pour mettre à jour les données du localStorage
// Nouvelle Génération des travaux à l'appuie du bouton 
const boutonMettreAJour = document.querySelector(".js-btn-maj");
const gallery =  document.querySelector(".gallery");
boutonMettreAJour.addEventListener("click", function () {
    window.localStorage.removeItem(key);
    gallery.innerHTML="";
    genererGallery(worksEtCategories.works);
});


//********************************** GESTION ADMIN ****************************************************//

/** Fonction qui vérifie qu'on est bien en admin et  active les privilèges
*/
function isAdmin(){
    /**   Séléction des différents élements qui apparait en mode Admin
    * @const {DOM Element} modify : correponds au bouton modifier de la galerie
    * @const {DOM Element} editionMode : correponds à l'en-tête du mode édition en admin
    * @const {DOM Element} log : correspond au lien login du menu nav 
    */
    const modify = document.querySelector("#portfolio i");
    const editionMode = document.querySelector(".editionMode");
    const log = document.querySelector(".login");

    // Récupération de la clé Admin dans la sessionStorage définit dans la fonction authentication sous config.js 
    const admin = window.sessionStorage.getItem("admin");
  
    // Si on est en admin
    if(admin){
        // Activation des privilèges en faisant apparaitre les élements invisible et en modifiant leur comportement pour les sr
        modify.classList.toggle("active");
        modify.toggleAttribute("aria-hidden");
        editionMode.classList.toggle("active");
        editionMode.toggleAttribute("aria-hidden");
        log.innerText = "logout";

        // Attention, ici il est important de transmettre showModal en tant que fonction de rappel (callback) sinon
        // le fonction se lance directement même sans le click
        modify.addEventListener("click", showModal);
       
        // Modification de logout à login une fois que l'on clique pour se déconnecter avec clear du sessionStorage
        // et de l'eventListener et remis en place des aria grâce au toogle précédant
        log.addEventListener("click", (e) => {
            e.target.innerText = "login";
            window.sessionStorage.removeItem("admin");        
            log.removeEventListener(e);
            // Pour la sécurité on enlève le listenerEvent du modal à la deconnexion
            modify.removeEventListener("click", showModal);
        });
    };
};
isAdmin();