const listModule = {
	/* 
    API CALLS
  */

	async getListsFromAPI() {
		const response = await fetch(`${app.base_url}/lists`);
		const lists = await response.json();
		lists.forEach((list) => {
			listModule.makeListInDOM(list);
		});
	},

	/* 
		DOM MANIPULATION
	*/

  /* Ajout d'une liste */

	showAddListModal(event) {
		event.preventDefault();
    const modal = document.getElementById('addListModal');
    modal.classList.add('is-active');
  },

	async handleAddListForm(event) {
    // on empêche le comportement par défaut du formulaire
    event.preventDefault();
    // on récupère le formulaire
    const addListModal = document.getElementById('addListModal');
    const form = addListModal.querySelector('form');
    // on récupère les données du formulaire
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      position: 1,
    };

    // on récupère l'ensemble des listes
    const lists = document.querySelectorAll('.panel');

    // on envoie les données du formulaire
    try {
      lists.forEach((list, index) => {
        const listId = list.getAttribute('data-list-id');
        const result = fetch(`${app.base_url}/lists/${listId}`, {
          method: 'PATCH',
          body: JSON.stringify({ position: (index + 2) }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      });

      const result = await fetch(`${app.base_url}/lists`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resultJson = await result.json();
      data.id = resultJson.id;
      listModule.makeListInDOM(data, 'prepend');
      addListModal.querySelector('input[name="name"]').value = '';
    } catch (error) {
      console.error(error);
      addListModal.querySelector('input[name="name"]').value = '';
    }
  },

  /* Modification d'une liste */

  showEditListInput(event) {
    event.preventDefault();
    const form = event.target.parentNode.querySelector('form');
    form.classList.remove('is-hidden');
    event.target.classList.add('is-hidden');
    console.log(event.target.textContent);
    form.querySelector('input[name="list-name"]').value = event.target.textContent;
    form.querySelector('input[name="list-name"]').focus();
    form.addEventListener('submit', listModule.handleEditListForm);
  },

  async handleEditListForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get('list-name'),
    };
    const listId = formData.get('list-id');

    try {
      const result = await fetch(`${app.base_url}/lists/${listId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resultJson = await result.json();
      const listTitle = form.parentNode.querySelector('.list-name');
      listTitle.textContent = resultJson[1][0].name;
      form.classList.add('is-hidden');
      listTitle.classList.remove('is-hidden');
    } catch (error) {
      console.error(error);
    }
  },

  /* Suppression d'une liste */

  async handleDeleteList(event) {
    event.preventDefault();
    const listElement = event.target.closest('.panel');
    const listId = listElement.getAttribute('data-list-id');

    // on récupère l'ensemble des listes se trouvant après la liste supprimée
    const lists = document.querySelectorAll(`.panel[data-list-id="${listId}"] ~ .panel`);

    try {
      lists.forEach((list, index) => {
        const listId = list.getAttribute('data-list-id');
        const result = fetch(`${app.base_url}/lists/${listId}`, {
          method: 'PATCH',
          body: JSON.stringify({ position: (index + 1) }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      });

      const result = await fetch(`${app.base_url}/lists/${listId}`, {
        method: 'DELETE',
      });
      const resultJson = await result.json();
      listElement.remove();
    } catch (error) {
      console.error(error);
    }
  },

	makeListInDOM(data, position = 'append') {
    // on récupère le template de liste
    const template = document.getElementById('list-template');
    // on clone le template
    const clone = document.importNode(template.content, true);
    // on remplit le clone
    clone.querySelector('.list-name').textContent = data.name;
    clone.querySelector('.panel').setAttribute('data-list-id', data.id);

    // on récupère le titre de la liste
    const listTitle = clone.querySelector('.list-name');
    // on ajoute un écouteur d'évènement sur le titre de la liste pour afficher le formulaire d'édition
    listTitle.addEventListener('dblclick', listModule.showEditListInput);

    // on modifie la valeur de l'input caché contenant l'id de la liste
    const listIdInput = clone.querySelector('input[name="list-id"]');
    listIdInput.value = data.id;

    // on récupère le buton de suppression de la liste
    const deleteListButton = clone.getElementById('list-delete-button');
    // on ajoute un écouteur d'évènement sur le bouton de suppression de la liste
    deleteListButton.addEventListener('click', listModule.handleDeleteList);

    // on récupère le bouton d'ouverture de la modale d'ajout de carte
    const modalCardButton = clone.querySelector('.is-pulled-right');
    // on parcourt les boutons d'ouverture
    modalCardButton.addEventListener('click', cardModule.showAddCardModal);

    // on ajoute le clone au DOM
    const listContainer = document.querySelector('.card-lists');
    if (position === 'append') listContainer.appendChild(clone);
    else if (position === 'prepend') listContainer.prepend(clone);

    if (data.cards) {
      data.cards.forEach((card) => {
        cardModule.makeCardInDOM(card);
      });
    }

    // on cache la modale
    app.hideModals();
  },
}