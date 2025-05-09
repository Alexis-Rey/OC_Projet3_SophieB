// Paramètrage de la config API en créant un objet JSON contenant l'URI des différentes collection, le nom de domaine (Host)
// et le token d'identification afin de permettre une stabilité de la connexion API si un des élements venaient à changer. 
// Bonne habitude pour des éventuels futures projets plus conséquent.
const config = {
    "Host": "http://localhost:5678/api",
    "Works": "/works",
    "Categories": "/categories",
    "Users": "/users/login",
    "Bearer-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
};

/**
 * Fonction permettant de communiquer en envoyant une requête à l'API afin de recevoir les travaux.
 */
export async function recupererTravaux(){
    const r = await fetch(config.Host + config.Works);
    if (r.ok === true){
        const data = await r.json();
        return data;
    }else {
        throw new Error("Erreur de communication avec l'API - Vérifier les config sur les travaux");
    }  
};

export async function recupererCategories(){
    const r = await fetch(config.Host + config.Categories);
    if (r.ok === true){
        const data = await r.json();
        return data;
    }else {
        throw new Error("Erreur de communication avec l'API - Vérifier les config sur les catégories");
    }  
};

export async function envoyerTravaux(){

};
