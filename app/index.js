const app = {
    init: () => {
        app.addListenerToActions();
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

        addListButton.addEventListener("click", app.showAddListModal);
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
        listForm.addEventListener("submit", app.handleAddListForm);
        addCardButtons.forEach(button => button.addEventListener("click", app.showAddCardModal));
        cardForm.addEventListener("submit", app.handleAddCardForm);
    },
    showAddListModal: () => {
        const addListModal = document.getElementById("addListModal");
        // classList est une méthode qui nous permet de manipuler les classes de l'élément.
        addListModal.classList.add("is-active");
    },
    hideModals: () => {
        const modals = document.querySelectorAll(".is-active");

        modals.forEach(modal => {
            modal.classList.remove("is-active");
        })
    },
    handleAddListForm: event => {
        // event nous provient du form lors de sa soumission (submit). Par défaut, un formulaire lorsqu'il est soumis va faire une requête avec les datas et recharger la page. Puisqu'on est dans le cadre d'une SPA, on ne veut pas recharger la page, on veut le gérer nous même.
        event.preventDefault();
        // Récupérer les datas directement depuis event est très compliqué (et propice aux erreurs). Pour se simplifier la tâche on va utiliser un outil fourni par JS appellé FormData.
        // Tout d'abord, on va devoir initialiser ce formData avec les valeurs du formulaire. Pour ça, on va créer une nouvelle instance de FormData avec en argument soit:
        // - directement le formulaire: new FormData(document.getElementById("listForm"));
        // - en lui passant le event.target récupérer à la soumission du formulaire: voir dessous.
        const formData = new FormData(event.target);
        const title = formData.get("name");
        app.makeListInDOM(title);
    },
    makeListInDOM: title => {
        // Je récupère le template créer dans mon index.html (voir le template comme un shéma/une recette).
        const listTemplate = document.getElementById("listTemplate");
        // Je crée une nouvelle liste grace au template.
        const newList = document.importNode(listTemplate.content, true);
        // Je modifie le titre de ma nouvelle liste pour qu'il corresponde à ce que j'aurais écrit dans le formulaire.
        const newListTitle = newList.getElementById("title");
        newListTitle.textContent = title;

        const addCardButton = newList.querySelector(".is-pulled-right");
        addCardButton.addEventListener("click", app.showAddCardModal);

        // Je récupère la div qui va contenir mes listes.
        const listContainer = document.querySelector(".card-lists");
        // Puis je rajoute ma nouvelle liste.
        listContainer.prepend(newList);

        // On ferme la modal lorsque la liste a été rajouté.
        app.hideModals();
    },
    showAddCardModal: event => {
        // Je récupère la modal de création de card.
        const addCardModal = document.getElementById("addCardModal");
        // Je l'affiche à l'écran.
        addCardModal.classList.add("is-active");

        // closest va me permettre de récupère l'élément parent avec la classe .panel le plus proche de ma target (la target c'est l'icone + qu'on vient de cliquer).
        const targetedList = event.target.closest('.panel');
        // L'élément récupéré au dessus est la liste dans laquel je voudrais rajouter une carte. On peut donc récupérer le listId (data-list-id) depuis ses attribues.
        const listId = targetedList.getAttribute("data-list-id");

        // Enfin, je préremplis l'input hidden (caché) avec l'id de la liste.
        const listIdInput = document.getElementById("listIdInput");
        listIdInput.value = listId;
    },
    handleAddCardForm: event => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const title = formData.get("name");
        const listId = formData.get("list_id");

        app.makeCardInDOM(title, listId);
    },
    makeCardInDOM: (title, listId) => {
        const cardTemplate = document.getElementById("cardTemplate");
        const newCard = document.importNode(cardTemplate.content, true);

        const newCardTitle = newCard.getElementById("title");
        newCardTitle.textContent = title;

        const list = document.querySelector(`[data-list-id="${listId}"]`);
        const cardContainer = list.querySelector(".list-container")
        cardContainer.prepend(newCard);

        app.hideModals();
    }
};

// addEventListener nous permet de réagir (exécuter une fonction) lors d'un événement particulier (dans ce cas, DOMContentLoaded, quand le contenu a été chargé).
// Attention, puisque addEventListener exécute une fonction, il faut lui donner une fonction (pas encore exécuter).
// app.init c'est la fonction, app.init() c'est si j'exécute la fonction (donc on ne met pas les paranthèses dans notre cas).
// Explication de l'event listener du dessous: Lorsque le contenu a terminé de chargé, on lance la fonction app.init.
document.addEventListener("DOMContentLoaded", app.init);