const cardModule = {

 /* Ajouter une nouvelle carte */

	showAddCardModal(event) {
    event.preventDefault();
    const modal = document.getElementById('addCardModal');
    modal.classList.add('is-active');
    // on définit l'id de la liste dans le formulaire
    modal.querySelector('input[name="list-id"]').value = event.target.closest('.panel').getAttribute('data-list-id');
  },

  async handleAddCardForm(event) {
    // on empêche le comportement par défaut du formulaire
    event.preventDefault();
    // on récupère le formulaire
    const addCardModal = document.getElementById('addCardModal');
    const form = addCardModal.querySelector('form');
    // on récupère les données du formulaire
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      position: 1,
      list_id: formData.get('list-id')
    };

    // on envoie les données du formulaire
    try {
      const result = await fetch(`${app.base_url}/cards`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resultJson = await result.json();
      data.id = resultJson.id;
      cardModule.makeCardInDOM(data);
    } catch (error) {
      console.error(error);
    }
  },

  /* Editer une carte */

  showEditCardInput(event) {
    event.preventDefault();
    // on récupère la carte
    const cardElement = event.target.closest('.box');
    const form = cardElement.querySelector('#card-form');
    // on affiche le formulaire
    form.classList.remove('is-hidden');
    const cardName = cardElement.querySelector('.card-name');
    // on cache le nom de la carte
    cardName.classList.add('is-hidden');

    // on remplit le formulaire avec le nom de la carte actuel
    form.querySelector('input[name="card-name"]').value = cardName.textContent;
    form.querySelector('input[name="card-name"]').focus();
    // on ajoute un écouteur d'évènement sur le formulaire : quand on soumet le formulaire, on lance cardModule.handleEditCardForm
    form.addEventListener('submit', cardModule.handleEditCardForm);
  },

  async handleEditCardForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    // on récupère les données du formulaire
    const data = {
      name: formData.get('card-name'),
    };
    const cardId = form.closest('.box').getAttribute('data-card-id');
    try {
      // on envoie les données du formulaire
      const result = await fetch(`${app.base_url}/cards/${cardId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resultJson = await result.json();
      // on met à jour le nom de la carte dans le DOM
      const cardName = form.closest('.box').querySelector('.card-name');
      cardName.textContent = resultJson[1][0].name;
      // on cache le formulaire et on affiche le nom de la carte
      cardName.classList.remove('is-hidden');
      form.parentNode.classList.add('is-hidden');
    } catch (error) {
      console.error(error);
    }
  },

  /* Supprimer une carte */

  async deleteCard(event) {
    event.preventDefault();
    // on récupère la carte
    const cardElement = event.target.closest('.box');
    const cardId = cardElement.getAttribute('data-card-id');
    try {
      // on envoie les données du formulaire
      const result = await fetch(`${app.base_url}/cards/${cardId}`, {
        method: 'DELETE',
      });
      const resultJson = await result.json();
      // on supprime la carte du DOM
      cardElement.remove();
    } catch (error) {
      console.error(error);
    }
  },

  makeCardInDOM(data) {
    // on récupère le template de carte
    const template = document.getElementById('card-template');
    // on clone le template
    const clone = document.importNode(template.content, true);
    // on remplit le clone
    clone.querySelector('.card-name').textContent = data.name;
    clone.querySelector('.box').dataset.cardId = data.id;

    // on ajoute les écouteurs d'évènements
    // on récupère le bouton d'edition de la carte
    const editButton = clone.getElementById('card-edit-button');
    // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance cardModule.showEditCardInput
    editButton.addEventListener('click', cardModule.showEditCardInput);

    // on récupère le bouton de suppression de la carte
    const deleteButton = clone.getElementById('card-delete-button');
    // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance cardModule.deleteCard
    deleteButton.addEventListener('click', cardModule.deleteCard);

    // on ajoute le clone au DOM
    const listContainer = document.querySelector(`.panel[data-list-id="${data.list_id}"] .panel-block`);
    listContainer.prepend(clone);
    // on cache la modale
    app.hideModals();
  },
};