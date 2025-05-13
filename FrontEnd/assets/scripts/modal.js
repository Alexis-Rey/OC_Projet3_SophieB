// ************************** FICHIER JS CONCERNANT LA MODALE  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

// Initialisation d'une variable pour contrôler que la modale est toujours ouverte
let isModalClose = false;
// On récupère l'élement DOM de la modale, du contenu modale et du bouton de fermeture
const modal = document.getElementById("js-modal-wrapper");
const modalContent = document.querySelector(".modalContent");
const xMark = document.querySelector(".closeModalWrapper");

/** Fonction qui affiche la modale */
export function showModal(){
    // On modifie les attributs de la modale pour la rendre visible pour tous.
    modal.setAttribute("aria-hidden","false");
    modal.setAttribute("style","display:flex;");
    
    // On écoute le bouton click sur la modale pour initier la première méthode de fermeture
    // Utilisation de l'écoute double-click, plus stable d'un point de vue UX, permet d'être sûre que c'est la volonté 
    // de l'utilisateur de vouloir fermer
    // On vérifie que l'écoute double-click n'est pas déjà lancer
    if(!isModalClose){
        // Attention, ici il est important de transmettre showModal en tant que fonction de rappel (callback) sinon
        // le fonction se lance directement même sans le double-click
        modal.addEventListener("dblclick",closeModal);
        // Appelle de la fonction propagationStop si on double-click sur le contenu
        modalContent.addEventListener("dblclick", propagationStop);
        xMark.addEventListener("click",closeModal);
        isModalClose = true;
    }
};

/** Fonction permettant de stopper la propagationa au parent donc ici le modalWrapper et éviter la fermeture sur le double-click sur le contenu */ 
const propagationStop = function (e){
    e.stopPropagation();
}

/** Fonction qui ferme la modale */
function closeModal(){
        modal.setAttribute("aria-hidden","true");
        modal.setAttribute("style","display:none;");
        modal.removeEventListener("dblclick", closeModal);
        xMark.removeEventListener("click", closeModal);
        isModalClose = false;
}