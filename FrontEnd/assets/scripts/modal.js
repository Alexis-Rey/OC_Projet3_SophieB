// ************************** FICHIER JS CONCERNANT LA MODALE  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

// Initialisation d'une variable pour contrôler que la modale est toujours ouverte
let adminUser;

/** Fonction qui affiche la modale
*/
export function showModal(){

    // On récupère l'élement DOM de la modale, modifie ses attributs pour le rendre visible pour tous.
    const modal = document.getElementById("js-modal-wrapper");
    modal.setAttribute("aria-hidden","false");
    modal.setAttribute("style","display:flex;");
};