// ************************** FICHIER JS CONCERNANT LES FILTRES  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

/**
 * Fonction de filtrage globale pour permettre de réagencer les travaux en ne gardant que ceux correpondant au filtre séléctionné
 * @param {array of object} works : les données des travaux issues de l'API reçu par la fonciton localOuApi
 * * @param {string} word : chaine de caractère définit selon la catégorie de filtre séléctionné
 */
export function filterWorks(works,word){

    // Dans le tableau des travaux, on applique un contrôle pour séléctionner uniquement les travaux correspondant au filtre sélécitonné représente par word
    const worksFiltered = works.filter(function(works){
        return works.category.name === word;
    })
    return worksFiltered;
};








