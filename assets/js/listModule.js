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

  /* Add new list */

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
      // A CHANGER
      position: 1,
    };

    // on envoie les données du formulaire
    try {
      const result = await fetch(`${app.base_url}/lists`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resultJson = await result.json();
      data.id = resultJson.id;
      listModule.makeListInDOM(data);
    } catch (error) {
      console.error(error);
    }
  },

  /* Edit a list */

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
      listTitle.textContent = data.name;
      form.classList.add('is-hidden');
      listTitle.classList.remove('is-hidden');
    } catch (error) {
      console.error(error);
    }
  },

	makeListInDOM(data) {
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

    // on récupère le bouton d'ouverture de la modale d'ajout de carte
    const modalCardButton = clone.querySelector('.is-pulled-right');
    // on parcourt les boutons d'ouverture
    modalCardButton.addEventListener('click', cardModule.showAddCardModal);

    // on ajoute le clone au DOM
    const listContainer = document.querySelector('.card-lists');
    listContainer.prepend(clone);

    if (data.cards) {
      data.cards.forEach((card) => {
        cardModule.makeCardInDOM(card);
      });
    }

    // on cache la modale
    app.hideModals();
  },
}