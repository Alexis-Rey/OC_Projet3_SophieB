// ************************** FICHIER JS CONCERNANT LA MODALE  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************
import { deleteWork, recupererTravaux } from "./config.js";
import { genererGallery } from "./script.js";
import { dropControl, toggleDropbox, initDragAndDrop, callbackCategories } from "./projet.js";
// On récupère l'élement DOM de la modale, du contenu modale, du bouton de fermeture, du bouton de retour, du bouton pour aller en page 2
const modal = document.getElementById("js-modal-wrapper");
const modalContent = document.querySelector(".modalContent");
const xMark = document.querySelector(".closeModalWrapper");
const btnPrev = document.getElementById("js-goto-page1");
const btnAjouterPhoto = document.getElementById("js-goto-page2");
const formulaire = document.getElementById("js-modal-form");

/** Fonction qui affiche la modale */
export function showModal(){

    // On modifie les attributs de la modale pour la rendre visible pour tous.
    modal.setAttribute("aria-hidden","false");
    modal.setAttribute("style","display:flex;");
    // Initialisation d'une variable indiquant la page actuelle
    let page = 1;

    // On récupère le titre est on met le focus dessus pour les utilisateurs de sr
    const titleModal = document.getElementById("js-modal-title1");
    titleModal.focus();

    // Fermeture
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

    // Appel de la fonction de génération du contenu dynamique en origin
    genererModale(page);

    // En fonction de la page voulu "aller en page 2" ou "retour en page 1" on regenère le bonne page
    btnAjouterPhoto.addEventListener("click",()=>{
        page = 2;
        genererModale(page)
        
    });
    btnPrev.addEventListener("click",()=>{
        page = 1;
        genererModale(page)
    });

};

export async function genererModale(page){
    // On reprends les données works du localStorage et on les parse pour les mettre en info JS
    // const worksModale = window.localStorage.getItem("mes-travaux");
    // const works = JSON.parse(worksModale);
    const works = await recupererTravaux();

    const modal1 = document.getElementById("js-modal-page1");
    const modal2 = document.getElementById("js-modal-page2");

    if(page === 1){
        btnPrev.setAttribute("style","display:none;");
        btnPrev.setAttribute("aria-hidden","true");
            
        modal1.style.display = "flex";
        modal1.setAttribute("aria-hidden","false");

        modal2.style.display = "none";
        modal2.setAttribute("aria-hidden","true");

        // Fonction de la génération gallery photo dans la modale et à l'accueil
        galleryShow(works); 
        genererGallery(works);  

    } else{
        btnPrev.setAttribute("style","display:block;");
        btnPrev.setAttribute("aria-hidden","false");
            
        modal1.style.display = "none";
        modal1.setAttribute("aria-hidden","true");

        modal2.style.display = "flex";
        modal2.setAttribute("aria-hidden","false");

        // Appelle fonction de la gestion de nouveau projet et du drag/drop
            injectProjectGesture();
            initDragAndDrop(dropboxOff); 
    };
};

/** Fonction qui genère la gallery photo */
/**  @param {array of object JS} works : données sur les travaux récupérées depuis le localStorage*/
function galleryShow(works){
    const modalGallery = document.getElementById("js-modal-bodyGallery");
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
    // Appel à la fonction de gestion des corbeilles.
    binGesture();
}

function injectProjectGesture(){

    const loadFile = document.getElementById("js-form-loadFile");
    
    // Ecoute de l'évènement annulation de l'importation par l"utilisateur
    loadFile.addEventListener("cancel",(e)=>{
        dropControl(e);
    });
    // Ecoute de l'évènement d'import de nouvelle image par l'utilisateur
    loadFile.addEventListener("change",(e)=>{
        dropControl(e);
    });

};

/** Fonction permettant de stopper la propagationa au parent donc ici le modalWrapper et éviter la fermeture sur le double-click sur le contenu */ 
const propagationStop = function (e){
    e.stopPropagation();
};

/** Fonction qui ferme la modale et qui reset le formulaire d'import */
export function closeModal(){

    // Disparition de la modale
    modal.setAttribute("aria-hidden","true");
    modal.setAttribute("style","display:none;");

    // Suppression des listeners
    modal.removeEventListener("dblclick", closeModal);
    xMark.removeEventListener("click", closeModal);

    // Passage en page 1 de la dropBox et reset formulaire
    toggleDropbox("off");
    formulaire.reset();
    const categorie = document.getElementById("enterCategorie");
    const errorMessage = document.getElementById("form-error");
    errorMessage.textContent = "";
    categorie.innerText = "";
    categorie.dataset.id = "undefined"

    // On efface les comportements de design erreur à la fermeture de la modale
    const infoImg = document.querySelector("#dropboxOff p");
    const dropboxOff = document.getElementById("dropboxOff");
    infoImg.style.color = "black";
    dropboxOff.style.border ="none";
};

// Fonction qui gère les corbeilles et le besoin de supprimer un travail
function binGesture(){
    const allBin = document.querySelectorAll(".imgRecycleBin");
   
    for(let i = 0; i < allBin.length; i++){
        allBin[i].addEventListener("click",async(e)=>{
            e.preventDefault();
            e.stopPropagation();
            const binSelect = parseInt(allBin[i].dataset.id);
            try{
                await deleteWork(binSelect);
                genererModale(1);
            }catch{
                console.error("Problème de suppresion de projet");
            }
        });
    };
};

// On récupère les catégories depuis l'API une seul fois pour les afficher dans la liste déroulante
callbackCategories();