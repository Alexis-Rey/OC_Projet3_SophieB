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
        presetPage2();

        // Mise en forme du fond pour montrer à l'utilisateur que tout est conforme
        dropboxOn.style.backgroundColor = "rgba(144, 238, 159, 0.2)";

        // Supprimer la précédente miniature s'il y en a une
        const oldImg= dropboxOn.querySelector(".importedImg");
        if (oldImg) oldImg.remove();
        
        // Création d'une miniature de l'img importé avant validaiton du formulaire pour expérience UX
        const imgImported = document.createElement("img");
        imgImported.classList.add("importedImg");
        imgImported.src = URL.createObjectURL(file);
        dropboxOn.appendChild(imgImported);
    }else{
        // On charge le preset page1
        presetPage();
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
  let sizeImg = sizeCalc.toFixed(2);
  if (sizeImg > tailleMax) {
    alert("L'image est trop lourde (max 4 Mo).");
    infoImg.innerText = ` Taille :${sizeImg}Mo - L'image  est trop lourde (max 4 Mo)`
    infoImg.style.color = "red";
    dropboxOff.style.border = "solid 1px red";
    formulaire.reset();
    return false;
  }else{
    return true;
  }
};

function presetPage(){
    formulaire.reset();
    // On fait réapparaitre la dropbox d'origine
    dropboxOff.style.display = "flex";
    dropboxOff.setAttribute("aria-hidden","false");

    // On fait disparaitre la nouvelle dropbox stylisé
    dropboxOn.style.display = "none";
    dropboxOn.setAttribute("aria-hidden","true");
    // On change l'id du bouton d'ajout d'img pour lui appliquer le positionnement d'origine
    loadFile.setAttribute("id","js-form-loadTitle");
    // On déplace le bouton dans son parent dropbox On 
    dropboxOff.appendChild(loadFile);
};

function presetPage2(){
    // On fait disparaitre la dropbox d'origine
    dropboxOff.style.display = "none";
    dropboxOff.setAttribute("aria-hidden","true");

    // On fait apparaitre la nouvelle dropbox stylisé
    dropboxOn.style.display = "flex";
    dropboxOn.setAttribute("aria-hidden","false");
    // On change l'id du bouton d'ajout d'img pour lui appliquer un nouveau positionnement
    loadFile.setAttribute("id","js-form-loadTitle2");
    // On déplace le bouton dans son nouveau parent dropboxOn
    dropboxOn.appendChild(loadFile);
};