
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

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );