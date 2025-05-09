// Import des fonctions issus de config.js
import { recupererTravaux, recupererCategories } from "./config.js";


// Initialisation des variables globales.
const key = "mes-travaux";
const key2 = "mes-catégories";
let works;
let categories; 


function genererPage(works, categories){
    try{
    genererGallery(works); 
    genererFilter(categories);
    }catch{
        console.log("Aucune gallery à générer, préciser les travaux en cours")
    };
}

async function localOuApi(){
    // Récupération d'info du localStroage correpondant à la clé
    let worksStorage = window.localStorage.getItem(key);

    // Si le localStorage est vide, on fait appel à l'api sinon on utilise ses données
    if (worksStorage === null){
        
        // Appelle à la fonction de récupération des travaux de l'API, gestion de l'erreur et 
        // initialisation d'un tableau vide si jamais une erreur est survenu.
        works = await recupererTravaux().catch(e=>{ console.error(e);
        return [];
        });

        // Transformation des données de JSON en valeurs JS et enregistrement en localStrorage
        const worksValues = JSON.stringify(works);
        window.localStorage.setItem(key,worksValues);
    } 
    else {
        // Récupération des données du localStorage mise en JSON
        works = JSON.parse(worksStorage)
    };

    categories = await recupererCategories().catch(e=>{ console.error(e)});
    return {works, categories}; 
};



/**
 * Fonction permettant de générer notre Gallery de travaux dynamiquement pour l'architecte Sophie Bluel
 * @param {JSON} travaux : les données des travaux issues de l'API
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
 * @param {JSON} Filtres : les données des catégories de filtre issues de l'API
 */
function genererFilter(Filtres){

    const menuFilter = document.querySelector(".menu-filter");

    // Initialisation d'une boucle qui va parcourir l'ensemble de nos catégories un à un pour créer nos boutons filtres 
    for ( let i = 0; i < categories.length; i++){
        // Création d'une balise button dédié à un filtre
        const buttonCategories = document.createElement("button");
        // Création des informations de chaque catégories grâce aux données issues de l'API
        buttonCategories.dataset.id = categories[i].id;
        buttonCategories.innerText = categories[i].name
        // Ajout d'une classe pour la partie design CSS
        buttonCategories.classList = "btn-filter"

        menuFilter.appendChild(buttonCategories);

    };
};


const worksEtCategories = await localOuApi();
genererPage(worksEtCategories.works, worksEtCategories.categories);


// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
  window.localStorage.removeItem(key);
});



