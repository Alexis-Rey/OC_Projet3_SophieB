// ************************** FICHIER JS CONCERNANT LES FILTRES  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

/**
 * Fonction de filtrage globale pour permettre de réagencer les travaux en ne gardant que ceux correspondant au filtre sélectionné
 * @param {Array<Object>} works : les données des travaux issues de l'API reçu par la fonction localOuApi
 * @param {string} word : chaine de caractère définit selon la catégorie de filtre séléctionné
 * @returns {Array<Object>} Travaux filtrés par catégorie. */
export function filterWorks(works,word){

    // Dans le tableau des travaux, on applique un contrôle pour sélectionner uniquement les travaux correspondant au filtre choisit représenté par "word"
    const worksFiltered = works.filter(function(work){
        return work.category.name === word;
    })
    return worksFiltered;
};








