const formulaire = document.getElementById("js-modal-form");
const infoImg = document.querySelector("#dropboxOff p");
const dropboxOff = document.getElementById("dropboxOff");
const dropboxOn =  document.getElementById("dropboxOn");
const loadFile = document.getElementById("js-form-loadTitle");

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
        imgImported.src = URL.createObjectURL(file);
        dropboxOn.appendChild(imgImported);
    }else{
        // On charge le preset page1
        toggleDropbox("off");
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
 * @param {string} state : l'état de la drop box: "on" = état origine pour importé une img; "off" état avec la miniture de l'img déjà ajouter
 */
export function toggleDropbox(state) {
    const isOn = state === "on";

    // Suivant l'état actuel on affiche ou non la dropboxOn
    dropboxOff.style.display = isOn ? "none" : "flex";
    dropboxOff.setAttribute("aria-hidden", isOn.toString());

    // Suivant l'état actuel on affiche ou non la dropboxOff et on lui mets un fond vert pour indiquer la bonne importation de l'img
    dropboxOn.style.display = isOn ? "flex" : "none";
    dropboxOn.setAttribute("aria-hidden", (!isOn).toString());
    dropboxOn.style.backgroundColor = isOn ? "rgba(144, 238, 159, 0.2)" : "";

    // Suivant l'état on change l'id du bouton pour changer son positionnement
    loadFile.setAttribute("id", isOn ? "js-form-loadTitle2" : "js-form-loadTitle");

    // On déplace le bouton d'ajout d'img dans la bonne dropbox parent suivant l'état
    (isOn ? dropboxOn : dropboxOff).appendChild(loadFile);

};
