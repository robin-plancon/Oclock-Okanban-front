// const utils = require("./utils.js");

const cardModule = {
    handleAddCardForm: async event => {
        event.preventDefault();

        const formData = new FormData(event.target);
        // const title = formData.get("name");
        const listId = formData.get("list_id");
        // On rajoute la position dans les données du formulaire, car position ne peut pas être null (on l'a configuré comme ça dans la BDD).
        const list = document.querySelector(`[data-list-id="${listId}"]`);
        const cards = list.querySelectorAll("[data-card-id]");
        const position = cards.length + 1;
        formData.set("position", position);

        const response = await fetch(`${utils.base_url}/cards`, {
            method: "POST",
            body: formData
        })

        if (response.status !== 200) {
            alert("Erreur serveur");
            return;
        }
        const newCard = await response.json();

        cardModule.makeCardInDOM(newCard);
    },
    // Je déstructure directement l'objet card dans les paramètres de la fonction.
    makeCardInDOM: ({ id, name, list_id, color }) => {
        const cardTemplate = document.getElementById("cardTemplate");
        const newCard = document.importNode(cardTemplate.content, true);

        const newCardTitle = newCard.getElementById("title");
        newCardTitle.textContent = name;

        // .parentNode permet de récupérer l'élément parent direct (l'élément juste au dessus de <i>).
        const modifyButton = newCard.querySelector('.fa-pencil-alt').parentNode;
        modifyButton.addEventListener('click', () => cardModule.toggleModifyForm(id));

        const newCardForm = newCard.querySelector("form");
        newCardForm.addEventListener("submit", async event => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const response = await fetch(`${utils.base_url}/cards/${id}`, {
                method: "PATCH",
                body: formData
            });

            if (response.status == 200) {
                newCardTitle.textContent = formData.get("name");
            }

            cardModule.toggleModifyForm(id);
        });

        // Même logique que pour la modification d'une carte, on rajoute un EventListener sur l'icone Trash.
        const deleteButton = newCard.querySelector('.fa-trash-alt').parentNode;
        deleteButton.addEventListener('click', async () => {
            const response = await fetch(`${utils.base_url}/cards/${id}`, {
                method: "DELETE"
            })

            if (response.status == 200) {
                // Je récupère la carte dans le dom, et je la retire avec remove.
                document.querySelector(`[data-card-id="${id}"]`).remove();
            }
        });

        const cardBox = newCard.querySelector(".box")
        cardBox.setAttribute("data-card-id", id);
        cardBox.style.backgroundColor = color;

        // La partie pour connecter le color picker.
        newCard.querySelector('[data-coloris]').addEventListener('click', () => {
            // Coloris m'est donné directement par le module que j'ai importé pour le color picker.
            Coloris({
                // la méthode onChange sera appelé à chaque fois que je cliquerais sur une couleur.
                onChange: async color => {
                    const formData = new FormData();
                    formData.set("color", color);

                    const response = await fetch(`${utils.base_url}/cards/${id}`, {
                        method: "PATCH",
                        body: formData
                    })

                    if (response.status == 200) {
                        cardBox.style.backgroundColor = color;
                    }
                }
            });
        });

        // Cette partie s'assure de rajouter la carte dans la liste correspondante.
        const list = document.querySelector(`[data-list-id="${list_id}"]`);
        const cardsContainer = list.querySelector(".list-container")
        cardsContainer.appendChild(newCard);

        utils.hideModals();
    },
    setDragDrop: (listId) => {
        const list = document.querySelector(`[data-list-id="${listId}"]`);
        const cardsContainer = list.querySelector(".list-container")

        Sortable.create(cardsContainer, {
            onEnd: async event => {
                const cards = event.to.children;
                let position = 0;

                for (index = 0; index < cards.length; index++) {
                    const cardId = cards[index].dataset.cardId;
                    const formData = new FormData();
                    formData.set("position", position);

                    await fetch(`${utils.base_url}/cards/${cardId}`, {
                        method: "PATCH",
                        body: formData
                    })

                    position = position + 1;
                }
            }
        });
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
    toggleModifyForm: id => {
        const card = document.querySelector(`[data-card-id="${id}"]`);
        const title = card.querySelector("#title");
        const form = card.querySelector("form");

        title.classList.toggle("is-hidden");
        form.classList.toggle("is-hidden");
    }
};

// module.exports = cardModule;