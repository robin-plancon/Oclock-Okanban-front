const listModule = {
    // De son nom, on cromprend que cette fonction nous permet de récupérer les lists depuis l'API (INDIRECTEMENT depuis la BDD).
    getListsFromAPI: async () => {
        // Par défaut, fetch fait les requêtes avec la méthode GET.
        const response = await fetch(`${app.base_url}/lists`);
        // .json ça permet de transformer la réponse en JS, mais seulement si la réponse est en JSON.
        const lists = await response.json();
        // Grace à forEach, je vais faire un makeListInDom pour chacune des listes qui sera dans le tableau lists.
        lists.forEach(list => {
            listModule.makeListInDOM(list);
        });
    },
    handleAddListForm: async event => {
        // event nous provient du form lors de sa soumission (submit). Par défaut, un formulaire lorsqu'il est soumis va faire une requête avec les datas et recharger la page. Puisqu'on est dans le cadre d'une SPA, on ne veut pas recharger la page, on veut le gérer nous même.
        event.preventDefault();
        // Récupérer les datas directement depuis event est très compliqué (et propice aux erreurs). Pour se simplifier la tâche on va utiliser un outil fourni par JS appellé FormData.
        // Tout d'abord, on va devoir initialiser ce formData avec les valeurs du formulaire. Pour ça, on va créer une nouvelle instance de FormData avec en argument soit:
        // - directement le formulaire: new FormData(document.getElementById("listForm"));
        // - en lui passant le event.target récupérer à la soumission du formulaire: voir dessous.
        const formData = new FormData(event.target);
        // Pour accéder aux datas via le format "FormData", j'utilise la méthode .get fourni par l'objet formData.
        // const title = formData.get("name");
        // Je peux rajouter des données moi même dans le formData (par exemple, la position qui n'est pas renseigné via le formulaire). J'utilise pour ça la méthode .set fournr par formData.
        formData.set("position", 1);
        // Je peux donner à fetch un objet en deuxième paramètre, dans cet objet j'aurais des précisions pour faire la requête (les options).
        const response = await fetch(`${app.base_url}/lists`, {
            // Je peux définir la méthode utilisée par fetch en renseignant "method".
            method: "POST",
            // Ici je peux renseigner mon body.
            // Méthode 1:
            // Si je renseigne mon body en transformant mes datas en JSON, je devrais prévenir le serveur.
            // body: JSON.stringify({
            //     name: title,
            //     position: 1
            // }),
            // // Ici, je préviens que les données que j'envoie dans ma requête sont au format JSON, si je ne le préviens pas, il n'utilisera pas express.json() (côté serveur) pour formatter puis utiliser les données que j'envoie.
            // headers: {
            //     'Content-Type': 'application/json'
            // }
            // Méthode 2:
            body: formData,
        });

        // Ici je vérifie le status de la réponse à la requête (200 == tout va bien).
        if (response.status !== 200) {
            alert("Erreur du serveur");
            return;
        }

        const newList = await response.json();

        listModule.makeListInDOM(newList);
    },
    // Directement, je destructure l'objet reçu en paramètre.
    makeListInDOM: ({ id, name, cards }) => {
        // Je récupère le template créer dans mon index.html (voir le template comme un shéma/une recette).
        const listTemplate = document.getElementById("listTemplate");
        // Je crée une nouvelle liste grace au template.
        const newList = document.importNode(listTemplate.content, true);
        // Je modifie le titre de ma nouvelle liste pour qu'il corresponde à ce que j'aurais écrit dans le formulaire.
        const newListTitle = newList.getElementById("title");
        newListTitle.textContent = name;
        newListTitle.addEventListener("dblclick", () => listModule.toggleModifyForm(id));

        // Je rajoute la logique pour le formulaire de modification du titre de la liste.
        const newListForm = newList.querySelector("form");
        newListForm.addEventListener("submit", async event => {
            event.preventDefault();
            const formData = new FormData(event.target);
            // Je fais une requête sur la route PATH /lists/:id, pour mettre à jour le nom de la liste sur notre BDD.
            const response = await fetch(`${app.base_url}/lists/${id}`, {
                method: "PATCH",
                body: formData
            });

            // Si la BDD a correctement modifié le nom, alors je le change aussi du côté du front (sur le DOM).
            if (response.status == 200) {
                newListTitle.textContent = formData.get('name');
            };

            // Dans tous les cas (réussite/échec), je cache le formulaire et je réaffiche le titre.
            listModule.toggleModifyForm(id);
        });

        const deleteButton = newList.querySelector('.fa-trash-alt').parentNode;
        deleteButton.addEventListener("click", async () => {
            if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette liste: ${newListTitle.textContent}.\nLa suppression de la liste est irréversible !`)) {
                const response = await fetch(`${app.base_url}/lists/${id}`, {
                    method: "DELETE"
                })

                if (response.status == 200) {
                    document.querySelector(`[data-list-id="${id}"]`).remove();
                }
            }
        })

        // Tout d'abord, je sélectionne la div dans newList qui porte l'attribue data-list-id.
        // Puis je donne une valeur à l'attribue data-list-id avec l'id de la liste (qui a été récupéré depuis l'API).
        newList.querySelector(".panel").setAttribute("data-list-id", id);

        const addCardButton = newList.querySelector(".is-pulled-right");
        addCardButton.addEventListener("click", cardModule.showAddCardModal);

        // Je récupère la div qui va contenir mes listes.
        const listContainer = document.querySelector(".card-lists");
        // Puis je rajoute ma nouvelle liste (prepend me permet de rajouter le nouvelle élément en première position, contrairement à appendChild qui l'ajoute en dernière position).
        listContainer.prepend(newList);

        // Maintenant que ma liste est créée et ajoutée au front, je vais aussi lui rajouter ses cards.
        // On rajoute une condition pour que si la liste n'a pas de cards, alors on essaye pas de faire un forEach dessus.
        if (cards) {
            cards.forEach(card => {
                cardModule.makeCardInDOM(card);
            })
        }

        // On ferme la modal lorsque la liste a été rajouté.
        app.hideModals();
    },
    showAddListModal: () => {
        const addListModal = document.getElementById("addListModal");
        // classList est une méthode qui nous permet de manipuler les classes de l'élément.
        addListModal.classList.add("is-active");
    },
    toggleModifyForm: id => {
        const list = document.querySelector(`[data-list-id="${id}"]`);
        const title = list.querySelector("#title");
        const form = list.querySelector("form");

        // Si la classe est présente, je la retire.
        title.classList.toggle("is-hidden");
        // Si la classe n'est pas présente, je l'ajoute.
        form.classList.toggle("is-hidden");
    }
}