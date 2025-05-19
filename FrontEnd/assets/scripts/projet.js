// ************************** FICHIER JS CONCERNANT LE FORMULAIRE DE NOUVEAU PROJET  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************
import { recupererCategories } from "./config.js";
import {closeModal} from "./modal.js";

const formulaire = document.getElementById("js-modal-form");
const infoImg = document.querySelector("#dropboxOff p");
const dropboxOff = document.getElementById("dropboxOff");
const dropboxOn =  document.getElementById("dropboxOn");
const loadFile = document.getElementById("js-form-loadTitle");
const inputTitle = document.getElementById("js-form-title");

export function dropControl(boxOpen){
    // Contrôle de l'event reçu en fonction du chargement d'une nouvelle image ou bien d'un cancel utilisateur
    // Si l'utilisateur cancel on reset le formulaire
    if (boxOpen.type === "cancel"){
        formulaire.reset();
    } else if (boxOpen.type === "change" && boxOpen.target.files.length === 1){
        const newImg = boxOpen.target.files[0];
        controleImg(newImg);
    }
};

/** Fonction pour importer permettre l'import d'une image conforme pour le formulaire
 * @param {object} file : L'image séléctionné par l'utilisateur soit avec l'input file soit en drag&drop
 */
function controleImg(file){
    const typeOk = controleType(file.type);
    const sizeOk = controleSize(file.size);
    
    // Si l'image est bonne on charge la miniature sinon on repasse au contrôle format page1
    if (typeOk && sizeOk){
        // On charge le preset page2  
        toggleDropbox("on");

        // Supprimer la précédente miniature s'il y en a une et on libère la mémoire occupé par l'ancienne url
        const oldImg= dropboxOn.querySelector(".importedImg");
        if (oldImg && oldImg.src.startsWith("blob:")){
            URL.revokeObjectURL(oldImg.src);
            oldImg.remove();  
        } 
        
        // Création d'une miniature de l'img importé avant validaiton du formulaire pour expérience UX
        const imgImported = document.createElement("img");
        imgImported.classList.add("importedImg");
        // Création d'une url à partir d'un objet 
        imgImported.src = URL.createObjectURL(file);
        // Mise à jour de l'input text en fonction du nom du fichier image
        const imgTitle = file.name.split(".");
        inputTitle.value = imgTitle[0];
        
        dropboxOn.appendChild(imgImported);

        // Appel de la fonction pour initialisé l'écoute drag/drop pour une possible modification de l'img
        initDragAndDrop(dropboxOn);
        return true;
    }else{
        // On charge le preset page1 pour retourner à l'état initial
        toggleDropbox("off");
        return false;
    }
};

// Fonction qui vérifie le type de l'img importé par rapport aux formats autorisés
function controleType(type){
    // Création d'un array avec les formats autorisés
    const extensionsOk = ["image/jpeg", "image/png"];
    // On cherche dans se tableau si le format de l'img importé si trouve, si oui on return true 
    // sinon false et on avertit l'utilisateur en enclenchant un reset du formulaire.
    if (!extensionsOk.includes(type)) {
        infoImg.innerText = ` Le format ${type} n'est pas un format supporté`
        infoImg.style.color = "red";
        dropboxOff.style.border = "solid 1px red";
        formulaire.reset();
        return false;
    } else{
        return true;
    }
};

// Fonction qui vérifie la taille de l'img importé par à la taille max autorisée
function controleSize(size){
    // Initalisation d'une constante qui contient la taille max autorisé ( 4 Mo )
    const tailleMax = 4;
    const sizeCalc = size / 1024 / 1024;

    // On ajuste la taille en gardant deux chiffre après la virgule
    let sizeImg = sizeCalc.toFixed(2);

    if (sizeImg > tailleMax) {
            infoImg.innerText = ` Taille :${sizeImg}Mo - L'image  est trop lourde (max 4 Mo)`
            infoImg.style.color = "red";
            dropboxOff.style.border = "solid 1px red";
            formulaire.reset();
            return false;
    }else{
            return true;
    }
};

/** Fonction pour générer dynamiquement la drop box d'importation d'img qui possède deux état
 * @param {string} state : l'état de la drop box: "off" = état origine pour importé une img; "on" état avec la miniture de l'img déjà ajouter
 */
export function toggleDropbox(state) {
    const isOn = state === "on";

    // Suivant l'état actuel on affiche ou non la dropboxOff
    dropboxOff.style.display = isOn ? "none" : "flex";
    dropboxOff.setAttribute("aria-hidden", isOn.toString());

    // Suivant l'état actuel on affiche ou non la dropboxOn et on lui mets un fond vert pour indiquer la bonne importation de l'img
    dropboxOn.style.display = isOn ? "flex" : "none";
    dropboxOn.setAttribute("aria-hidden", (!isOn).toString());
    dropboxOn.style.backgroundColor = isOn ? "rgba(144, 238, 159, 0.2)" : "";

    // Suivant l'état on change l'id du bouton "ajouter photo" pour changer son positionnement
    loadFile.setAttribute("id", isOn ? "js-form-loadTitle2" : "js-form-loadTitle");

    // On déplace le bouton d'ajout d'img dans la bonne dropbox parent suivant l'état
    (isOn ? dropboxOn : dropboxOff).appendChild(loadFile);
};

/**  Fonction permettant à l'utilisateur de glisser/déposer une img si il préfère
* @param {var} dropbox: le nom de la variable dropbox que l'on souhaite modifier suivant l'état, soit dropboxOff au moment de l'import
 soit dropboxOn au moment de la modification de l'import effectué*/
export function initDragAndDrop(dropBox) {

    // Empêche le comportement par défaut pour tous les événements de drag & drop
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropBox.addEventListener(eventName, e => e.preventDefault());
        dropBox.addEventListener(eventName, e => e.stopPropagation());
    });

    // Highlight quand on entre dans la zone
    dropBox.addEventListener("dragenter", () => {
        dropBox.style.border = "2px dashed green";
        dropBox.style.backgroundColor = "rgba(144, 238, 159, 0.1)";
    });

    // Supprimer le highlight quand on quitte la zone
    dropBox.addEventListener("dragleave", () => {
        dropBox.style.border = "";
        dropBox.style.backgroundColor = "";
    });

    // Gestion du drop
    dropBox.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length === 1) {
            const imgControled = controleImg(files[0]);
            // On vérifie si l'image en drag&drop est conforme si oui on l'injecte , cela empêche l'utilisateur de forcer une img non conforme à l'envoi formulaire
            if (imgControled){
                // On injecte manuellement le fichier dans l'input type="file" grâce à la création d'un objet DataTranser utilisé par input type=file 
                // pour stocker les fichiers ce qui permet actuellement rien de plus au niveau de la miniature mais permettra au FormData du formulaire
                // de recupérer l'img même si elle proviens d'ici
                const fileInput = document.getElementById("js-form-loadFile");
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(files[0]);
                fileInput.files = dataTransfer.files;
            }

        } else {
            dropBox.style.backgroundColor = "rgba(227, 109, 93, 0.3)";
            console.error("Vous ne pouvez déposer qu’un seul fichier à la fois."); 
        } 

        // Reset style
        dropBox.style.border = "";
        
    });
}

// ************************** PARTIE SUR LES CATEGORIES ****************************************************
// Fonction permettant de faire un choix de catégorie parmis les options proposées par l'Api
export async function callbackCategories(){
    const arrowList = document.querySelector(".dropdownMark");
    const listCategories = document.getElementById("js-form-options");
    // Variable pour savoir si la liste est chargé ou non 
    let isCategoriesLoad = false;
    // Variable pour savoir si la liste est visible ou non
    let isListVisible = false;
    
    // On récupère les catégories depuis l'API
    const apiCategories = await recupererCategories();
    
    // Au clique sur l'icone de la liste , on la fait apparaitre, puis si cette dernière est vide on genère les catégories
    // enfin on appelle la fonction qui gérera le choix de la catégorie par l'utilisateur
    arrowList.addEventListener("click",(e)=>{
        
        // Si la liste n'est pas visible on l'affiche sinon on la camoufle
        if(!isListVisible){
            // Affiche la liste
            listCategories.style.display = "flex";
            listCategories.setAttribute("aria-hidden","false");
            arrowList.style.transform = "rotate(90deg)"
        }else{
            listCategories.style.display = "none";
            listCategories.setAttribute("aria-hidden","true");
            arrowList.style.transform = "rotate(0)"
        }

        // Si les catégories ne sont pas encore chargées
        if(!isCategoriesLoad){
            // Création des options de listes
            for(let i=0; i<apiCategories.length; i++){
                const optionsValues = document.createElement("li");
                optionsValues.innerText = apiCategories[i].name;
                optionsValues.dataset.name = apiCategories[i].name;
                optionsValues.dataset.id = apiCategories[i].id;
                optionsValues.classList.add("optionsValues");
                listCategories.appendChild(optionsValues);
            };
            choiceCategories();
            isCategoriesLoad = true;  
        };   
        // On indique que la liste est désormais visible ou caché
        isListVisible = !isListVisible;
    });
};

// Fonction qui affecte la catégorie sélectioné par l'utilisateur dans l'input catégorie 
function choiceCategories(){
    const listOptions = document.querySelectorAll(".optionsValues");
    const optionSelected = document.getElementById("enterCategorie");

    // On écoute chaque options
    for (let o=0; o<listOptions.length; o++){
        listOptions[o].addEventListener("click",()=>{
            // A chaque choix on efface la valeur de l'input Catégories et on lui affecte le choix utilisateur
            optionSelected.innerText = "";
            optionSelected.innerText = listOptions[o].dataset.name;
            optionSelected.dataset.id = listOptions[o].dataset.id;
        });
    };
};

// ************************** PARTIE SUR LE CONTROLE FORMULAIRE ET ENVOI****************************************************

function controleFormulaire(){
    const formulaire = document.getElementById("js-modal-form");
    const errorMessage = document.getElementById("form-error");

    // Ecoute de la tentative d'envoi du formulaire avec l'event submit
    formulaire.addEventListener("submit", (e)=>{
        // On empêche le comportement par défault du formulaire pour l'empecher d'actualiser la page et on récupère le form et la catégorie
        e.preventDefault();
        errorMessage.textContent = "";

        try{
            const categorie = document.getElementById("enterCategorie");
            const imgTitle = document.getElementById("js-form-title").value.trim();
            const importedImg = document.getElementById("js-form-loadFile");
            const file = importedImg.files[0];

            // Vérifications globale du formulaire
            if(!file) throw new Error("Aucune image n'a été importé, merci de sélectionner une image");
            if(!imgTitle) throw new Error("Le champ Titre est vide, merci de renseigner un titre pour le projet");
            if(categorie.dataset.id === undefined || categorie.dataset.id === "undefined") throw new Error("Le champ catégorie est vide, merci de choisir une catégorie dans la liste");

            console.log(categorie.dataset.id);
            if(file && imgTitle && categorie.dataset.id !== undefined && categorie.dataset.id !== "undefined"){
                // Création d'un nouveau FormData qui contiendra nos informations relative au formulaire
                const formData = new FormData(formulaire);
                formData.append("id",categorie.dataset.id);
                console.log(formData);
                // Reset formulaire quand il est validé
                closeModal();
            } 
        }catch(error){
            errorMessage.textContent = error.message;
            console.error(error);
        };
    });   
};

// Appel au contrôle formulaire initiale
controleFormulaire();