const getTodos = async () => {
    // Avec fetch, on peut faire des requêtes du côté de notre front. Fetch est asynchrone, donc on utilise await pour attendre que la fonction soit terminée (requête).
    // fetch reçoit en paramètre l'url vers laquelle on veut faire notre requête.
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    // Attention, pour pouvoir accéder aux datas de la réponse, il faut d'abord les formatter avec .json().
    const datas = await response.json();

    console.log(datas);
}

const postTodo = async () => {
    // Dans le cadre d'une requête post, je fais donner à ma fonction fetch un deuxième paramètre, qui est un objet.
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        // On peut préciser la méthode à utiliser pour la requête (par défaut GET si pas précisé).
        method: "POST",
        // On peut remplir le body via la propriété body (attention, on doit respecter le format attendu par notre serveur/API).
        body: {
            title: "Thomas"
        }
    })
    const data = await response.json();

    console.log(data);
}

postTodo();