
// on objet qui contient des fonctions
var app = {
  base_url: 'http://localhost:3000',

  // fonction d'initialisation, lancée au chargement de la page
  init() {
    console.log('app.init !');
    // on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
    app.addListenerToActions();
    app.getListsFromAPI();
  },

  addListenerToActions() {
    // on récupère le bouton d'ouverture de la modale
    const modalListButton = document.getElementById('addListButton');
    // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance app.showAddListModal
    modalListButton.addEventListener('click', app.showAddListModal);

    // on récupère le bouton d'ouverture de la modale
    const modalCardButton = document.querySelectorAll('.is-pulled-right');
    // on parcourt les boutons d'ouverture
    modalCardButton.forEach( function(element) {
      // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance app.showAddCardModal
      element.addEventListener('click', app.showAddCardModal);
    });

    // on récupère les boutons de fermeture de la modale
    const modalCloseButtons = document.querySelectorAll('.close');
    // on parcourt les boutons de fermeture
    modalCloseButtons.forEach( function(element) {
      // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance app.hideModals
      element.addEventListener('click', app.hideModals);
    });

    // on récupère le bouton de validation du formulaire d'ajout de liste
    const addListModal = document.getElementById('addListModal');
    const addListFormButton = addListModal.querySelector('.button, .is-success');
    // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance app.handleAddListForm
    addListFormButton.addEventListener('click', app.handleAddListForm);

    // on récupère le bouton de validation du formulaire d'ajout de carte
    const addCardModal = document.getElementById('addCardModal');
    const addCardFormButton = addCardModal.querySelector('.button, .is-success');
    // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance app.handleAddCardForm
    addCardFormButton.addEventListener('click', app.handleAddCardForm);
  },

  showAddListModal() {
    const modal = document.getElementById('addListModal');
    modal.classList.add('is-active');
  },

  showAddCardModal(event) {
    event.preventDefault();
    const modal = document.getElementById('addCardModal');
    modal.classList.add('is-active');
    // on définit l'id de la liste dans le formulaire
    modal.querySelector('input[name="list-id"]').value = event.target.closest('.panel').dataset.listId;
  },

  hideModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach( function(element) {
      element.classList.remove('is-active');
    });
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
      app.makeListInDOM(data);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
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
      app.makeCardInDOM(data);
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
    modalCardButton.addEventListener('click', app.showAddCardModal);

    // on ajoute le clone au DOM
    const listContainer = document.querySelector('.card-lists');
    listContainer.appendChild(clone);

    // on cache la modale
    app.hideModals();
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

  /* 
    API CALLS
  */

  async getListsFromAPI() {
    const response = await fetch(`${app.base_url}/lists`);
    const lists = await response.json();
    lists.forEach((list) => {
      app.makeListInDOM(list);
      list.cards.forEach((card) => {
        app.makeCardInDOM(card);
      });
    });
  },

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );