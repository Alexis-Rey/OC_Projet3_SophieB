import { authentication } from "./config.js";

//  Ecoute du bouton de la page formulaire pour l'authentification d'utilisateur 
const form = document.getElementById("contactForm");
    form.addEventListener("submit", (e) =>{
        e.preventDefault();
        const user = {
            email: e.target.querySelector("#email").value,
            password: e.target.querySelector("#pass-word").value
        };
        
        // Instauration de Regex pour contrôler le mail et mot de passe en double sécurité du required appliqué aux input form.
        // le mail doit avoir un format normal de type : marcthiebault@gmail.com avec contrôle après le .
        // le mot de passe doit avoir au moins une minuscule, une majuscule, un chiffre et être entre 2 à  8 caractères
        let regex = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z]{2,3}$");
        let mailRegex = regex.test(user.email);
        //  ici ?= est un lockhead positif qui indique que dans le groupe à droit "il doit y avoir" et .* indique n'importe quel caractère répétée 0 ou plusieurs fois
        let regex2 = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{2,8}$");
        let pwRegex = regex2.test(user.password);

        if (mailRegex === true && pwRegex === true){
            const auth = JSON.stringify(user)
                authentication(auth);       
        }else{
            e.target.querySelector("#email").value = "";
            e.target.querySelector("#pass-word").value ="";
        }
         
 });