const listModule = {
	/* 
    API CALLS
  */

	async getListsFromAPI() {
		const response = await fetch(`${app.base_url}/lists`);
		const lists = await response.json();
		lists.forEach((list) => {
			listModule.makeListInDOM(list);
			list.cards.forEach((card) => {
				cardModule.makeCardInDOM(card);
			});
		});
	},

	/* 
		DOM MANIPULATION
	*/

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
      position: 20,
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
      console.log(result);
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
    clone.querySelector('.panel').dataset.listId = data.id;

    // on récupère le bouton d'ouverture de la modale
    const modalCardButton = clone.querySelector('.is-pulled-right');
    // on parcourt les boutons d'ouverture
    modalCardButton.addEventListener('click', cardModule.showAddCardModal);

    // on ajoute le clone au DOM
    const listContainer = document.querySelector('.card-lists');
    listContainer.appendChild(clone);

    // on cache la modale
    app.hideModals();
  },
}