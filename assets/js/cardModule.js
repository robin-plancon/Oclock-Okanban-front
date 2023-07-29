const cardModule = {
	showAddCardModal(event) {
    event.preventDefault();
    const modal = document.getElementById('addCardModal');
    modal.classList.add('is-active');
    // on définit l'id de la liste dans le formulaire
    modal.querySelector('input[name="list-id"]').value = event.target.closest('.panel').dataset.listId;
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
      position: formData.get('position'),
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

  makeCardInDOM(data) {
    // on récupère le template de carte
    const template = document.getElementById('card-template');
    // on clone le template
    const clone = document.importNode(template.content, true);
    // on remplit le clone
    clone.querySelector('.card-name').textContent = data.name;
    clone.querySelector('.box').dataset.cardId = data.id;
    // on ajoute le clone au DOM
    const listContainer = document.querySelector(`.panel[data-list-id="${data.list_id}"] .panel-block`);
    listContainer.appendChild(clone);
    // on cache la modale
    app.hideModals();
  },
};