// ************************** FICHIER JS CONCERNANT LE FONCTIONNEMENT GLOBALE DU SITE  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************
// Import des fonctions issus de config.js
import { recupererTravaux, recupererCategories} from "./config.js";
import { filterWorks } from "./filtre.js";
import { showModal } from "./modal.js";
import { deleteHisto, listenEdition } from "./historique.js";
 
/** Initialisation des variables globales.
 * @param {string} key : la clé du localStorage
 * @param {object} works : les données des travaux
 * @param {object} categories : les données des catégories
 * @param {HTMLElement} gallery : Element DOM de la gallery d'accueil */
const key = "mes-travaux";
const keyc = "mes-categories";
let works;
let categories; 
const gallery =  document.querySelector(".gallery");


/**
 * Fonction permettant de générer notre Page d'accueil dynamiquement pour l'architecte Sophie Bluel
 * @param {array of object} works : les données des travaux issues de l'API reçu par la fonciton localOuApi
 * * @param {array of object} categories : les données des catégories issues de l'API reçu par la fonciton localOuApi
 */
function genererPage(works, categories){
    try{
    genererGallery(works); 
    genererFilter(categories);
    }catch(error){
        console.log("Problème dans la génération de la page:", error);
    };
}

// Fonction permettant de récupérer nos travaux et catégories depuis l'API ou depuis le localStorage si cette dernière n'est
// pas accessible
export async function localOuApi(){
    // Récupération des données  du localStroage correpondant aux clés présentes
    let worksStorage = window.localStorage.getItem(key);
    let categoriesStorage = window.localStorage.getItem(keyc);

    // Test API : Appelle à la fonction de récupération des travaux de l'API, on gère les erreurs et on  retourne null si jamais une erreur est survenu.
    works = await recupererTravaux().catch(e=>{ console.error(e);
        console.error("Connexion API échoué, récupération des travaux depuis le cache . . . ")
        return null;
    });

    if (works) {
        // Si l'API a répondu, on enregistre et utilise ses données
        const worksValues = JSON.stringify(works);
        window.localStorage.setItem(key, worksValues);
    } else if (worksStorage !== null) {
        // Si l'API a échoué mais qu'on a quelque chose en localStorage
        works = JSON.parse(worksStorage);
        console.error("Merci de patienter, les données proviennent du cache, les images resteront indisponibles")
    } else {
        // Rien dans l'API et rien dans le localStorage
        works = [];
        console.error("Le cache est vide, nous travaillons sur le problème, revenez vers nous dans quelques temps")
    }

    // Test API - Récupération des catégories 
    categories = await recupererCategories().catch(e=>{ console.error(e)
        console.error("Connexion API échoué, récupération des catégories depuis le cache . . . ")
        return null;
    });

    if (categories) {
        // Si l'API a répondu, on enregistre et utilise ses données
        const categoriesValues = JSON.stringify(categories);
        window.localStorage.setItem(keyc, categoriesValues);
    } else if (categoriesStorage !== null) {
        // Si l'API a échoué mais qu'on a quelque chose en localStorage
        categories = JSON.parse(categoriesStorage);
    } else {
        // Rien dans l'API et rien dans le localStorage
        categories = [];
        console.error("Le cache est vide, nous travaillons sur le problème, revenez vers nous dans quelques temps")
    };
    return {works, categories}; 
};



/**
 * Fonction permettant de générer notre Gallery de travaux dynamiquement pour l'architecte Sophie Bluel
 * @param {array of object} travaux : les données des travaux issues de l'API
 */
// Tentative d'export de la fonction pour affichage en temps réel d'une suppresion dans modal.js
export function genererGallery(travaux){
    // Suppresion du contenu de la gallery car l'affichage se fait dynamiquement.
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

//*********** GESTION AFFICHAGE DES FILTRES ET DES TRAVAUX EN FONCTION DU FILTRE SELECTIONE PAR L'UTILISATEUR ****************************//

/** Fonction pour générer dynamiquement les filtres et les afficher ainsi que de permettre le rafraississement de la gallery dynamiquement en fonction du choix utilisateur
 * @param {array of object} Filtres : les données des catégories de filtre issues de l'API
 */
function genererFilter(Filtres){
    const menuFilter = document.querySelector(".menu-filter");

    // Gestion du bouton "TOUS" qui réiniatilise le filtre et affiche l'ensemble des projets.
    const boutonMettreAJour = document.createElement("button");
    boutonMettreAJour.setAttribute("id","js-btn-maj");
    boutonMettreAJour.innerText = "Tous";
    boutonMettreAJour.addEventListener("click", function () {
        gallery.innerHTML="";
        genererGallery(worksEtCategories.works);
    });
    // Ajout bouton dans le DOM
    menuFilter.appendChild(boutonMettreAJour);

    // Gestion des autres boutons : Initialisation d'une boucle qui va parcourir l'ensemble de nos catégories un à un pour créer nos boutons filtres 
    for ( let i = 0; i < Filtres.length; i++){
        // Création d'une balise button dédié à un filtre
        const buttonCategories = document.createElement("button");
        // Création des informations de chaque catégories grâce aux données issues de l'API
        buttonCategories.dataset.id = Filtres[i].id;
        buttonCategories.innerText = Filtres[i].name;
        // Ajout d'une classe pour la partie design CSS
        buttonCategories.classList = "btn-filter";

        buttonCategories.addEventListener("click", () => {
        // Ici on recupère category.id et category.name directement
        const categoryName = Filtres[i].name;
        const worksFiltered = filterWorks(worksEtCategories.works, categoryName);
        // Rafraichissement de la page et nouvelle génération dynamique des travaux filtrés
        gallery.innerHTML="";
        genererGallery(worksFiltered);
        });

        // Ajout des boutons dans le DOM 
        menuFilter.appendChild(buttonCategories);
    };
};

// Première Génération de la page d'accueil du Site, on test d'abord si les données sont issus de l'API
// ou du localStorage puis on génère la page à partir de ces données
const worksEtCategories = await localOuApi();
genererPage(worksEtCategories.works, worksEtCategories.categories);



//********************************** GESTION ADMIN ****************************************************//

/** Fonction qui vérifie qu'on est bien en admin et  active les privilèges*/
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

        // Suppression de la zone de filtres en cachant sa visibilité en mode Admin et modification marge pour cohérence design de la maquette
        const menuFilter = document.querySelector(".menu-filter");
        const galeryTitle = document.querySelector("#portfolio h2");
        menuFilter.style.display = "none";
        galeryTitle.setAttribute("style", "margin-bottom: 4.5em");

        // Initialisation de la fonction édition qui permet d'avoir l'historique Admin
        listenEdition();
        // Initalisation de la fonction de suppresion d'historique
        deleteHisto();

        modify.addEventListener("click", (e)=>{
            showModal();
        });
        // Rajout de la même foncitonnalité mais à la pression au clavier pour l'accésibilité sr
        modify.addEventListener("keydown",(e)=>{
            if(e.key === "Enter"){
                showModal();
            }
        })

        // Modification de logout à login une fois que l'on clique pour se déconnecter avec clear du sessionStorage admin
        // et de l'eventListener
        log.addEventListener("click", (e) => {
            e.target.innerText = "login";
            window.sessionStorage.removeItem("admin");        
            // Pour la sécurité on enlève le listenerEvent du modal à la deconnexion
            modify.removeEventListener("click", showModal);
        });
    };
};

isAdmin();
