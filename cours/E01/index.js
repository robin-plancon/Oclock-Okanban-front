const app = {
    init: () => {
        // Sélectionner un élément (querySelector, querySelectorAll, getElementBy..., getElementsBy):
        const div = document.querySelector("#app");
        // textContent permet de mettre du text dans notre élément.
        div.textContent = "Yost";

        // createElement pour créer un nouvel élément (dans notre cas, une balise <p>):
        const p = document.createElement("p");
        p.textContent = "Fruits";

        // Pour rajouter un élément à un autre élément, je peux me servir de méthode comme appendChild (rajoute à la suite) ou prepend (ajoute au début):
        div.appendChild(p);

        const button = document.createElement("button");
        button.textContent = "Récupérer les fruits"
        div.appendChild(button);

        // Pour rajouter un événement à notre bouton, je me sers de addEventListener:
        button.addEventListener("click", app.getFruits);
    },
    getFruits: () => {
        const div = document.querySelector("#app");

        const fruits = [
            { id: 1, name: "Kiwi", unitPrice: 1, quantity: 6 },
            { id: 2, name: "Pomme", unitPrice: 0.8, quantity: 2 },
            { id: 3, name: "Raisin", unitPrice: 2.5, quantity: 1 },
            { id: 4, name: "Fraise", unitPrice: 3.5, quantity: 1 },
        ];

        // Premier exemple (révision simple):
        // Pour rajouter tous les fruits de mon tableau, je peux me servir de la méthode forEach:
        // forEach va exécuter la fonction (callback) donnant en paramètre pour chaque élément de mon tableau.
        // fruits.forEach(fruit => {
        //     const p = document.createElement("p");
        //     p.textContent = fruit.name;
        //     div.appendChild(p);
        // });

        // Deuxième exemple (révision avancée):
        // Je sors le ul de mon forEach, car je ne crée qu'un seul tableau.
        // const ul = document.createElement("ul");

        // fruits.forEach(fruit => {
        //     const li = document.createElement("li");
        //     const title = document.createElement("h3");
        //     const price = document.createElement("p");
        //     const quantity = document.createElement("p");

        //     title.textContent = fruit.name;
        //     price.textContent = `Prix: ${fruit.unitPrice}`;
        //     quantity.textContent = `Quantité: ${fruit.quantity}`;

        //     li.appendChild(title);
        //     li.appendChild(price);
        //     li.appendChild(quantity);

        //     ul.appendChild(li);
        // });

        // div.appendChild(ul);

        // Troisième exemple (nouvelle méthode: Les templates):
        // Un template, c'est tout simplement un code HTML déjà écrit, qu'on pourra réutiliser pour créer de nouveaux éléments.
        // Pour sélectionner un template:
        const fruitTemplate = document.getElementById("fruit-template");

        // Petit Rappel: On peut destructurer un objet directement dans les paramètres d'une fonction.
        fruits.forEach(({ name, unitPrice, quantity }) => {
            // Une fois qu'on a sélectionné notre template, on va créer un nouvel élément grâce à cet template. Pour ça on se sert de la méthode importNode. Cette méthode prend en paramètre deux arguments, la template à utiliser (plus précisement le contenu de cet template), et un boolean (pour l'instant, on ne s'occupe pas du deuxième arguement, on mettra toujours true).
            const newFruit = document.importNode(fruitTemplate.content, true);

            newFruit.querySelector('.title').textContent = name;
            newFruit.querySelector('.price').textContent = unitPrice;
            newFruit.querySelector('.quantity').textContent = quantity;

            div.appendChild(newFruit);
        })
    }
};

// Je rajoute une sécurité pour dire que je ne veux exécuter la méthode init qu'après le chargement total de l'application.
document.addEventListener("DOMContentLoaded", app.init);