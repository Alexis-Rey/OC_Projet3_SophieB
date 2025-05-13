// ************************** FICHIER JS CONCERNANT LES CONNEXIONS API  ****************************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

// Paramètrage de la config API en créant un objet JSON contenant l'URI des différentes collection et le nom de domaine (Host)
//  afin de permettre une stabilité de la connexion API si un des élements venaient à changer. 
// Bonne habitude pour des éventuels futures projets plus conséquent.
const config = {
    "Host": "http://localhost:5678/api",
    "Works": "/works",
    "Categories": "/categories",
    "Users": "/users/login"
};

/**
 * Fonction permettant de communiquer en envoyant une requête à l'API afin de recevoir les travaux.
 */
export async function recupererTravaux(){
    const r = await fetch(config.Host + config.Works);
    // Si le requête c'est bien passé on renvoie les données en format js sinon on informe de l'erreur
    if (r.ok === true){
        const data = await r.json();
        return data;
    }else {
        throw new Error("Erreur de communication avec l'API - Vérifier les config sur les travaux");
    }  
};

/**
 * Fonction permettant de communiquer en envoyant une requête à l'API afin de recevoir les catégories.
 */
export async function recupererCategories(){
    const r = await fetch(config.Host + config.Categories);
    // Si le requête c'est bien passé on renvoie les données en format js sinon on informe de l'erreur
    if (r.ok === true){
        const data = await r.json();
        return data;
    }else {
        throw new Error("Erreur de communication avec l'API - Vérifier les config sur les catégories");
    }  
};

/**
 * Fonction permettant de communiquer en envoyant une requête à l'API afin de s'identifier en tant qu'administrateur.
 * @param  {JSON} auth : les infos mail et password provenant du formulaire.
 */
export async function authentication(auth){
    // Initialisation d'une clé pour la sessionStorage
    const keyAuth = "admin";
    // Tentative d'envoie des informations à l'API
    const r = await fetch(config.Host + config.Users,{
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: auth
    });
    // Si le requête c'est bien passé et que les identifiants sont les bons on enregistre le token reçu dans la sessionStorage 
    // et on renvoie sur la page d'accueil sinon on gère les erreurs.
    if (r.ok === true && r.status === 200) {
        const data = await r.json();
        window.sessionStorage.setItem(keyAuth, data.token);
        window.location.href= "././index.html";
    } else if (r.status >= 500) {
        throw new Error("Erreur de communication avec l'API - Vérifier les config sur les users");
    } else {
        throw new Error("Erreur d'identification, veuillez recommencer.");
    } ;
};
