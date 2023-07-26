
// on objet qui contient des fonctions
var app = {

  // fonction d'initialisation, lancée au chargement de la page
  init() {
    console.log('app.init !');
    // on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
    app.addListenerToActions();
  },

  addListenerToActions() {
    // on récupère le bouton d'ouverture de la modale
    const modalButton = document.getElementById('addListButton');
    // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance app.showAddListModal
    modalButton.addEventListener('click', app.showAddListModal);

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
  },

  showAddListModal() {
    const modal = document.getElementById('addListModal');
    modal.classList.add('is-active');
  },

  hideModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach( function(element) {
      element.classList.remove('is-active');
    });
  },

  handleAddListForm(event) {
    // on empêche le comportement par défaut du formulaire
    event.preventDefault();
    // on récupère le formulaire
    const addListModal = document.getElementById('addListModal');
    const form = addListModal.querySelector('form');
    // on récupère les données du formulaire
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
    };
    // on envoie les données du formulaire
    app.makeListInDOM(data);
    console.log(data);
  },

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );