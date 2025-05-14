// ************************** FICHIER JS CONCERNANT LA MODALE  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************
// On récupère l'élement DOM de la modale, du contenu modale, du bouton de fermeture et du titre
const modal = document.getElementById("js-modal-wrapper");
const modalContent = document.querySelector(".modalContent");
const xMark = document.querySelector(".closeModalWrapper");

/** Fonction qui affiche la modale */
export function showModal(){

    // On modifie les attributs de la modale pour la rendre visible pour tous.
    modal.setAttribute("aria-hidden","false");
    modal.setAttribute("style","display:flex;");

    // On récupère le titre est on met le focus dessus pour les utilisateurs de sr
    const titleModal = document.getElementById("js-modal-title1");
    titleModal.focus();

    // On reprends les données works du localStorage et on les parse pour les mettre en info JS
    const worksModale = window.localStorage.getItem("mes-travaux");
    const works = JSON.parse(worksModale);
    // Appel de la fonction de génération du modal dynamique
    genererModale(works);
    
    // On écoute le bouton click sur la modale pour initier la première méthode de fermeture
    // Utilisation de l'écoute double-click, plus stable d'un point de vue UX, permet d'être sûre que c'est la volonté 
    // de l'utilisateur de vouloir fermer
    // Attention, ici il est important de transmettre showModal en tant que fonction de rappel (callback) sinon
    // le fonction se lance directement même sans le double-click
     modal.addEventListener("dblclick",closeModal);
    // Appelle de la fonction propagationStop si on double-click sur le contenu
    modalContent.addEventListener("dblclick", propagationStop);
    // Ecoute du click sur le bouton fermeture
    xMark.addEventListener("click",closeModal);
};

/** Fonction qui ferme la modale */
/**  @param {array of object JS} works : données sur les travaux récupérées depuis le localStorage*/

function genererModale(works){
    const modalGallery = document.getElementById("js-modal-bodyGallery");
    const btnAjouterPhoto = document.getElementById("js-goto-page2");
    modalGallery.innerHTML= "";
     for(let i = 0; i<works.length; i++){
        // Création d'une balises figure dédié à un travail
        const figure = document.createElement("figure");

        // Création des informations de chaque travail grâce aux info issu du localStorage
        const img = document.createElement("img");
        img.src = works[i].imageUrl;
        img.alt = works[i].title;
        img.classList.add("imgWorks");

        // Création de la corbeille de suppression propre à chaque travaux
        const imgRecycleBin =  document.createElement("img");
        imgRecycleBin.src = "./assets/icons/corbeille.png";
        imgRecycleBin.alt = `Corbeille de ${works[i].title}`;
        imgRecycleBin.classList.add("imgRecycleBin");
        imgRecycleBin.dataset.id = works[i].id;
        
        // Rattachement des éléments créer et configurer dans le DOM
        figure.appendChild(imgRecycleBin);
        figure.appendChild(img);
        modalGallery.appendChild(figure);
    };

    btnAjouterPhoto.addEventListener("click", genererSecondeModale);

};

function genererSecondeModale(){
    const modal1 = document.getElementById("js-modal-page1");
    const modal2 = document.getElementById("js-modal-page2");
    const btnPrev = document.getElementById("js-goto-page1");

    btnPrev.setAttribute("style","display:block;");
    btnPrev.setAttribute("aria-hidden","false");

    modal1.style.display = "none";
    modal1.setAttribute("aria-hidden","true");

    modal2.style.display = "flex";
    modal2.setAttribute("aria-hidden","false");


};

/** Fonction permettant de stopper la propagationa au parent donc ici le modalWrapper et éviter la fermeture sur le double-click sur le contenu */ 
const propagationStop = function (e){
    e.stopPropagation();
};

/** Fonction qui ferme la modale */
function closeModal(){
    modal.setAttribute("aria-hidden","true");
    modal.setAttribute("style","display:none;");
    modal.removeEventListener("dblclick", closeModal);
    xMark.removeEventListener("click", closeModal);
};