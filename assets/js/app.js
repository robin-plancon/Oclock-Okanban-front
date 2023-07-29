const app = {
  base_url: 'http://localhost:3000',

  // fonction d'initialisation, lancée au chargement de la page
  init() {
    console.log('app.init !');
    // on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
    app.addListenerToActions();
    listModule.getListsFromAPI();
  },

  addListenerToActions() {
    // on récupère le bouton d'ouverture de la modale
    const modalListButton = document.getElementById('addListButton');
    // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance app.showAddListModal
    modalListButton.addEventListener('click', listModule.showAddListModal);

    // on récupère le bouton d'ouverture de la modale
    const modalCardButton = document.querySelectorAll('.is-pulled-right');
    // on parcourt les boutons d'ouverture
    modalCardButton.forEach( function(element) {
      // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance app.showAddCardModal
      element.addEventListener('click', cardModule.showAddCardModal);
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
    addListFormButton.addEventListener('click', listModule.handleAddListForm);

    // on récupère le bouton de validation du formulaire d'ajout de carte
    const addCardModal = document.getElementById('addCardModal');
    const addCardFormButton = addCardModal.querySelector('.button, .is-success');
    // on accroche un écouteur d'évènement sur le bouton : quand on clique, on lance app.handleAddCardForm
    addCardFormButton.addEventListener('click', cardModule.handleAddCardForm);
  },

  hideModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach( function(element) {
      element.classList.remove('is-active');
    });
  },
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );