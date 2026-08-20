// todo.js
// Fabrique (factory function) pour créer un todo.
// Un todo est un simple objet de données : pas de méthodes, juste des propriétés.
// Les modifications (changer la priorité, marquer comme terminé, etc.) se font
// directement dans app.js en changeant les propriétés de l'objet.

// Les 3 priorités possibles, réutilisées à la fois par le formulaire (dom.js)
// et par le CSS (classes .priorite-basse/moyenne/haute).
export const PRIORITES = ["basse", "moyenne", "haute"];

export function createTodo(titre, description, dateEcheance, priorite = "moyenne") {
  return {
    // crypto.randomUUID() génère un identifiant unique, disponible nativement
    // dans le navigateur (pas besoin de librairie externe).
    id: crypto.randomUUID(),
    titre,
    description,
    dateEcheance, // format "YYYY-MM-DD", tel que renvoyé par <input type="date">
    priorite,
    terminee: false,
  };
}
