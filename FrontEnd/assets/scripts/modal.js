// ************************** FICHIER JS CONCERNANT LA MODALE  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************
import { deleteWork, recupererTravaux } from "./config.js";
import { genererGallery } from "./script.js";
import { dropControl, toggleDropbox, initDragAndDrop, callbackCategories, dropboxOff, showOrHideList, dropDownList } from "./projet.js";
import { historicUpdate } from "./historique.js";

/** Initialisation des variables globales DOM.
 * @param {HTMLElement} modal: La modale
 * @param {HTMLElement} modalContent : Contenu de la modale
 * @param {HTMLElement} xMark : bouton de fermeture
 * @param {HTMLElement} btnPrev : bouton de retour en arrière 
 * @param {HTMLElement} btnAjouterPhoto : bouton pour aller en page modale 2 
 * @param {HTMLElement} formulaire : formulaire de la modale */
const modal = document.getElementById("js-modal-wrapper");
const modalContent = document.querySelector(".modalContent");
const xMark = document.querySelector(".closeModalWrapper");
const btnPrev = document.getElementById("js-goto-page1");
const btnAjouterPhoto = document.getElementById("js-goto-page2");
const formulaire = document.getElementById("js-modal-form");

/** Fonction qui permet d'afficher la modale */
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
    // On écoute le bouton click sur la modale pour initier la première méthode de fermeture.
    // Utilisation de l'écoute double-click, plus stable d'un point de vue UX, permet d'être sûre que c'est la volonté de l'utilisateur de vouloir fermer
    // Attention, ici il est important de transmettre closeModal ou propagationStop en tant que fonction de rappel (callback) sinon la fonction se lance directement même sans le double-click.
    modal.addEventListener("dblclick",closeModal);
    // Appelle de la fonction propagationStop si on double-click sur le contenu
    modalContent.addEventListener("dblclick", propagationStop);
    // Ecoute du click sur le bouton fermeture
    xMark.addEventListener("click",closeModal);

    // Appel de la fonction de génération du contenu dynamique en origine
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

/** Fonction qui genère la page modale appropriée*/
/**  @param {int} page : numéro de la page que l'on souhaite atteindre*/
export async function genererModale(page){
   
    // On récupère les données depuis l'API
    const works = await recupererTravaux();
    // Récupèration des éléments du DOM correpondant respectivement à la page 1 ou 2 du modal 
    const modal1 = document.getElementById("js-modal-page1");
    const modal2 = document.getElementById("js-modal-page2");

    // Si on est sur la page 1 on genère la gallery avec les projet supprimable sinon on génère le formulaire d'ajout de projet
    if(page === 1){
        btnPrev.setAttribute("style","display:none;");
        btnPrev.setAttribute("aria-hidden","true");
            
        modal1.style.display = "flex";
        modal1.setAttribute("aria-hidden","false");

        modal2.style.display = "none";
        modal2.setAttribute("aria-hidden","true");

        // Appel des fonctions pour générer la gallerie photo dans la modale et actualiser celle de l'accueil en cas de suppresion
        galleryShow(works); 
        genererGallery(works);  

    } else{
        btnPrev.setAttribute("style","display:block;");
        btnPrev.setAttribute("aria-hidden","false");
            
        modal1.style.display = "none";
        modal1.setAttribute("aria-hidden","true");

        modal2.style.display = "flex";
        modal2.setAttribute("aria-hidden","false");

        // Appelle fonction de la gestion de nouveau projet et du drag&drop sur la dropBox d'origine
            injectProjectGesture();
            initDragAndDrop(dropboxOff); 
    };
};

/** Fonction qui genère la gallery photo */
/**  @param {array of object JS} works : données sur les travaux récupérées depuis l'Api*/
function galleryShow(works){
    const modalGallery = document.getElementById("js-modal-bodyGallery");
    modalGallery.innerHTML= "";
    
    for(let i = 0; i<works.length; i++){
        // Création d'une balises figure dédié à un travail
        const figure = document.createElement("figure");

        // Création des informations de chaque travail grâce aux données récoltées
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

/** Fonction qui gère la demande d'ajout de nouveau projet */
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

/** Fonction permettant de stopper la propagation au parent donc ici le modalWrapper et éviter la fermeture sur le double-click sur le contenu */ 
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
    modalContent.removeEventListener("dblclick", propagationStop);

    // Passage en page 1 de la dropBox et reset formulaire
    toggleDropbox("off");
    formulaire.reset();

    // On remets en état initiale les messages d'erreur et la liste catégories
    const categorie = document.getElementById("enterCategorie");
    const errorMessage = document.getElementById("form-error");
    errorMessage.textContent = "";
    categorie.innerText = "";
    categorie.dataset.id = "undefined"
    showOrHideList(false);
    dropDownList.isListVisible = false;

    // On efface les comportements de design erreur qui apparaisse sur une mauvaise importation à la fermeture de la modale
    const infoImg = document.querySelector("#dropboxOff p");
    const dropboxOff = document.getElementById("dropboxOff");
    infoImg.style.color = "black";
    dropboxOff.style.border ="none";
};


// Fonction qui gère les corbeilles et le besoin de supprimer un travail
function binGesture(){
    // On récupère les éléments DOM de chaque corbeilles
    const allBin = document.querySelectorAll(".imgRecycleBin");

    // On écoute chacune d'entre elle détécter celle qui doit envoyer une demande de suppresion
    for(let i = 0; i < allBin.length; i++){
        allBin[i].addEventListener("click",async(e)=>{
            e.preventDefault();
            e.stopPropagation();
            // On convertit la valeur string de la corbeille en int 
            const binSelect = e.currentTarget.dataset.id;

            // On récupère l'image associé à la poubelle séléctionné pour l'historique
            const imgDelete = e.currentTarget.nextElementSibling;

            try{
                await deleteWork(binSelect);
                genererModale(1);
                historicUpdate(imgDelete,"delete");
            }catch{
                console.error("Problème de suppresion de projet");
            }
        });
    };
};


// On récupère les catégories depuis l'API une seul fois pour les afficher dans la liste déroulante
callbackCategories();