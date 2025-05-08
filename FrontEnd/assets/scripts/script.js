// Import des fonctions issus de config.js
import { recupererTravaux } from "./config.js";

// Appelle à la fonction de récupération des travaux de l'API, gestion de l'erreur et 
// initialisation d'un tableau vide jamais une erreur est survenu.
const travaux = await recupererTravaux().catch(e=>{
    console.error(e);
    return [];
});


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

try{
   genererGallery(travaux); 
}catch{
    console.log("Aucune gallery à générer, préciser les travaux en cours")
};






