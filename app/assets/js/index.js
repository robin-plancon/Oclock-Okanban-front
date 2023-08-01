const cardModule = require("./cardModule.js");
const listModule = require("./listModule.js");

const app = {
    // Je met l'url de mon serveur API (notre projet de saison 6)
    init: () => {
        app.addListenerToActions();
        listModule.getListsFromAPI();
    },
    addListenerToActions: () => {
        const addListButton = document.getElementById("addListButton");
        // Manière alternative avec querySelector:
        // const addListButton = document.querySelector("#addListButton");
        // const hideModalButtons = document.getElementsByClassName("close");
        // Manière alternative avec querySelectorAll:
        const hideModalButtons = document.querySelectorAll(".close");
        // Méthode si on rajoute un id sur le formulaire:
        const listForm = document.getElementById("listForm");
        // Méthode sans rajouter l'id (sans toucher le index.html):
        // D'abord on récupère la modal addListModal avec document.getElementById("addListModal"), puis on cherche à l'intérieur un formulaire avec .querySelector("form"). On ne cherche le form que dans la modal, et pas dans tout le document.
        // const listForm = document.getElementById("addListModal").querySelector("form");
        const addCardButtons = document.querySelectorAll(".is-pulled-right");
        const cardForm = document.getElementById("cardForm");

        addListButton.addEventListener("click", listModule.showAddListModal);
        // Méthode si on utilise getElementsByClassName.
        // Je fais une boucle for pour parcourir mon tableau hideModalButtons.
        // for (let index = 0; index < hideModalButtons.length; index = index + 1) {
        //     // Pour récupérer un élément d'un tableau HTMLCollection, on doit utiliser la méthode item avec l'index de l'élément en argument.
        //     const button = hideModalButtons.item(index);
        //     // Je rajoute un eventListener sur chacun des boutons, un à un, grace à ma boucle for.
        //     button.addEventListener("click", app.hideModals);
        // };
        // Méthode si on utilise querySelectorAll.
        hideModalButtons.forEach(button => button.addEventListener("click", app.hideModals));
        listForm.addEventListener("submit", listModule.handleAddListForm);
        addCardButtons.forEach(button => button.addEventListener("click", cardModule.showAddCardModal));
        cardForm.addEventListener("submit", cardModule.handleAddCardForm);
    }
};

// addEventListener nous permet de réagir (exécuter une fonction) lors d'un événement particulier (dans ce cas, DOMContentLoaded, quand le contenu a été chargé).
// Attention, puisque addEventListener exécute une fonction, il faut lui donner une fonction (pas encore exécuter).
// app.init c'est la fonction, app.init() c'est si j'exécute la fonction (donc on ne met pas les paranthèses dans notre cas).
// Explication de l'event listener du dessous: Lorsque le contenu a terminé de chargé, on lance la fonction app.init.
document.addEventListener("DOMContentLoaded", app.init);