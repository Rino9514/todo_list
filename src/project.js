// project.js
// Fabrique pour créer un projet. Comme pour todo.js, on reste sur un simple
// objet de données : le tableau "todos" est manipulé directement (push,
// splice, etc.) depuis app.js plutôt que via des méthodes sur l'objet.

export function createProject(nom) {
  return {
    id: crypto.randomUUID(),
    nom,
    todos: [],
  };
}
