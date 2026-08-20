// app.js
// Contrôleur de l'application : détient l'état en mémoire (la liste des
// projets et le projet actuellement sélectionné) et expose les seules
// fonctions que dom.js a le droit d'appeler. C'est le seul fichier qui
// connaît à la fois todo.js, project.js et storage.js.

import { createTodo } from "./todo.js";
import { createProject } from "./project.js";
import { sauvegarderProjets, chargerProjets } from "./storage.js";

let projets = [];
let projetActifId = null;

// À appeler une seule fois, au démarrage de l'application.
export function initialiserApp() {
  const projetsSauvegardes = chargerProjets();

  if (projetsSauvegardes) {
    projets = projetsSauvegardes;
  } else {
    // Première visite (ou données invalides) : on crée un projet par défaut.
    projets = [createProject("Général")];
    sauvegarderProjets(projets);
  }

  projetActifId = projets[0].id;
}

export function getProjets() {
  return projets;
}

export function getProjetActif() {
  return projets.find((projet) => projet.id === projetActifId);
}

export function selectionnerProjet(projetId) {
  projetActifId = projetId;
}

export function creerProjet(nom) {
  const nouveauProjet = createProject(nom);
  projets.push(nouveauProjet);
  sauvegarderProjets(projets);
  return nouveauProjet;
}

export function supprimerProjet(projetId) {
  // Le premier projet créé (le projet par défaut) ne peut pas être supprimé,
  // pour toujours garder au moins un projet disponible.
  if (projetId === projets[0].id) return;

  projets = projets.filter((projet) => projet.id !== projetId);

  if (projetActifId === projetId) {
    projetActifId = projets[0].id;
  }

  sauvegarderProjets(projets);
}

export function creerTodo(projetId, titre, description, dateEcheance, priorite) {
  const projet = projets.find((p) => p.id === projetId);
  if (!projet) return;

  const nouveauTodo = createTodo(titre, description, dateEcheance, priorite);
  projet.todos.push(nouveauTodo);
  sauvegarderProjets(projets);
  return nouveauTodo;
}

export function supprimerTodo(projetId, todoId) {
  const projet = projets.find((p) => p.id === projetId);
  if (!projet) return;

  projet.todos = projet.todos.filter((todo) => todo.id !== todoId);
  sauvegarderProjets(projets);
}

export function modifierTodo(projetId, todoId, donnees) {
  const projet = projets.find((p) => p.id === projetId);
  if (!projet) return;

  const todo = projet.todos.find((t) => t.id === todoId);
  if (!todo) return;

  // On fusionne les nouvelles valeurs (titre, description, dateEcheance, priorite)
  // dans l'objet todo existant.
  Object.assign(todo, donnees);
  sauvegarderProjets(projets);
}
