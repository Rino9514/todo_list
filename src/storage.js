// storage.js
// Seul module qui touche localStorage. Les projets et leurs todos étant de
// simples objets de données (pas de méthodes), JSON.stringify/JSON.parse
// suffit à les sauvegarder et les recharger tels quels.

const CLE_STOCKAGE = "todoListApp";

export function sauvegarderProjets(projets) {
  localStorage.setItem(CLE_STOCKAGE, JSON.stringify(projets));
}

// Retourne le tableau de projets sauvegardé, ou null s'il n'y a rien
// (première visite) ou si les données sont corrompues.
export function chargerProjets() {
  const donnees = localStorage.getItem(CLE_STOCKAGE);
  if (!donnees) return null;

  try {
    return JSON.parse(donnees);
  } catch {
    return null;
  }
}
