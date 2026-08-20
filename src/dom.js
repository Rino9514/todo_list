// dom.js
// Gère tout l'affichage (rendu du HTML) et les événements (clics, formulaires).
// Ce module ne connaît jamais localStorage ni les fabriques todo.js/project.js :
// il passe uniquement par les fonctions publiques de app.js.

import * as app from "./app.js";

// Éléments HTML récupérés une seule fois.
const listeProjetsEl = document.querySelector("#liste-projets");
const listeTodosEl = document.querySelector("#liste-todos");
const titreProjetActifEl = document.querySelector("#titre-projet-actif");

const dialogTodo = document.querySelector("#dialog-todo");
const formTodo = document.querySelector("#form-todo");
const dialogProjet = document.querySelector("#dialog-projet");
const formProjet = document.querySelector("#form-projet");

// Point d'entrée du module, appelé une seule fois depuis index.js.
export function initialiserUI() {
  afficherProjets();
  afficherTodos();
  installerEcouteurs();
}

// --- Rendu ---------------------------------------------------------------

function afficherProjets() {
  listeProjetsEl.innerHTML = "";

  const projetActif = app.getProjetActif();

  app.getProjets().forEach((projet) => {
    const li = document.createElement("li");
    li.dataset.id = projet.id;
    li.classList.toggle("actif", projet.id === projetActif.id);

    const nomSpan = document.createElement("span");
    nomSpan.textContent = projet.nom;
    li.appendChild(nomSpan);

    const btnSupprimer = document.createElement("button");
    btnSupprimer.textContent = "×";
    btnSupprimer.dataset.action = "supprimer-projet";
    li.appendChild(btnSupprimer);

    listeProjetsEl.appendChild(li);
  });

  titreProjetActifEl.textContent = projetActif.nom;
}

function afficherTodos() {
  listeTodosEl.innerHTML = "";

  const projetActif = app.getProjetActif();

  projetActif.todos.forEach((todo) => {
    const li = document.createElement("li");
    li.dataset.id = todo.id;

    const pastille = document.createElement("span");
    pastille.classList.add("pastille-priorite", `priorite-${todo.priorite}`);
    li.appendChild(pastille);

    const titreSpan = document.createElement("span");
    titreSpan.textContent = todo.titre;
    li.appendChild(titreSpan);

    if (todo.dateEcheance) {
      const dateSpan = document.createElement("span");
      dateSpan.classList.add("date-echeance");
      dateSpan.textContent = todo.dateEcheance;
      li.appendChild(dateSpan);
    }

    const btnSupprimer = document.createElement("button");
    btnSupprimer.textContent = "×";
    btnSupprimer.dataset.action = "supprimer-todo";
    li.appendChild(btnSupprimer);

    listeTodosEl.appendChild(li);
  });
}

function rafraichirTout() {
  afficherProjets();
  afficherTodos();
}

// --- Écouteurs d'événements ------------------------------------------------

function installerEcouteurs() {
  // Délégation d'événements : un seul écouteur par liste plutôt qu'un par
  // élément (qu'il faudrait sans cesse recréer à chaque rafraîchissement).
  listeProjetsEl.addEventListener("click", gererClicListeProjets);
  listeTodosEl.addEventListener("click", gererClicListeTodos);

  document.querySelector("#btn-nouveau-projet").addEventListener("click", () => {
    formProjet.reset();
    dialogProjet.showModal();
  });

  document.querySelector("#btn-nouveau-todo").addEventListener("click", () => {
    formTodo.reset();
    formTodo.elements.id.value = "";
    dialogTodo.showModal();
  });

  document.querySelector("#btn-annuler-projet").addEventListener("click", () => {
    dialogProjet.close();
  });

  document.querySelector("#btn-annuler-todo").addEventListener("click", () => {
    dialogTodo.close();
  });

  formProjet.addEventListener("submit", gererSoumissionProjet);
  formTodo.addEventListener("submit", gererSoumissionTodo);
}

function gererClicListeProjets(event) {
  const li = event.target.closest("li");
  if (!li) return;

  if (event.target.dataset.action === "supprimer-projet") {
    if (confirm("Supprimer ce projet et tous ses todos ?")) {
      app.supprimerProjet(li.dataset.id);
      rafraichirTout();
    }
    return;
  }

  app.selectionnerProjet(li.dataset.id);
  rafraichirTout();
}

function gererClicListeTodos(event) {
  const li = event.target.closest("li");
  if (!li) return;

  if (event.target.dataset.action === "supprimer-todo") {
    if (confirm("Supprimer ce todo ?")) {
      app.supprimerTodo(app.getProjetActif().id, li.dataset.id);
      afficherTodos();
    }
    return;
  }

  // Clic sur le todo lui-même : ouvre le formulaire d'édition pré-rempli.
  const todo = app.getProjetActif().todos.find((t) => t.id === li.dataset.id);
  if (!todo) return;

  formTodo.elements.id.value = todo.id;
  formTodo.elements.titre.value = todo.titre;
  formTodo.elements.description.value = todo.description;
  formTodo.elements.dateEcheance.value = todo.dateEcheance;
  formTodo.elements.priorite.value = todo.priorite;
  dialogTodo.showModal();
}

function gererSoumissionProjet(event) {
  const nom = formProjet.elements.nom.value.trim();
  if (!nom) return;

  const nouveauProjet = app.creerProjet(nom);
  app.selectionnerProjet(nouveauProjet.id);
  rafraichirTout();
}

function gererSoumissionTodo(event) {
  const donnees = new FormData(formTodo);
  const id = donnees.get("id");
  const titre = donnees.get("titre").trim();
  if (!titre) return;

  const description = donnees.get("description").trim();
  const dateEcheance = donnees.get("dateEcheance");
  const priorite = donnees.get("priorite");

  const projetActifId = app.getProjetActif().id;

  if (id) {
    app.modifierTodo(projetActifId, id, { titre, description, dateEcheance, priorite });
  } else {
    app.creerTodo(projetActifId, titre, description, dateEcheance, priorite);
  }

  afficherTodos();
}
