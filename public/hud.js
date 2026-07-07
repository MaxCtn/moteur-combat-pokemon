const combattants = {
  attaquant: { nom: "Salamèche", type: "feu", pv: 100, pvMax: 100 },
  cible: { nom: "Bulbizarre", type: "plante", pv: 100, pvMax: 100 },
};

let tour = 1;

const attaquantHp = document.querySelector('[data-cy="attaquant-hp"]');
const cibleHp = document.querySelector('[data-cy="cible-hp"]');
const tourTexte = document.querySelector('[data-cy="tour"]');
const baseInput = document.querySelector('[data-cy="base-input"]');
const btnAttaque = document.querySelector('[data-cy="btn-attaque"]');
const btnRecommencer = document.querySelector('[data-cy="btn-recommencer"]');
const journal = document.querySelector('[data-cy="journal"]');
const banniere = document.querySelector('[data-cy="banniere"]');
const barreAttaquant = document.getElementById("barre-attaquant");
const barreCible = document.getElementById("barre-cible");

function efficacite(degats, base) {
  if (degats > base) return "Super efficace";
  if (degats < base) return "Pas très efficace";
  return "Efficace";
}

function largeur(combattant) {
  return (combattant.pv / combattant.pvMax) * 100 + "%";
}

function rendre() {
  attaquantHp.textContent = String(combattants.attaquant.pv);
  cibleHp.textContent = String(combattants.cible.pv);
  tourTexte.textContent = "Tour " + tour;
  barreAttaquant.style.width = largeur(combattants.attaquant);
  barreCible.style.width = largeur(combattants.cible);
}

function ajouterEntree(texte) {
  const entree = document.createElement("li");
  entree.setAttribute("data-cy", "log-entry");
  entree.textContent = texte;
  journal.insertBefore(entree, journal.firstChild);
}

async function attaquer() {
  const base = Number(baseInput.value);
  const corps = {
    type: combattants.attaquant.type,
    cible: combattants.cible.type,
    base: base,
  };

  const reponse = await fetch("/combat/degats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corps),
  });

  if (!reponse.ok) {
    return;
  }

  const donnees = await reponse.json();
  const degats = donnees.degats;

  combattants.cible.pv = Math.max(0, combattants.cible.pv - degats);
  ajouterEntree(
    "Tour " +
      tour +
      " — " +
      combattants.attaquant.nom +
      " inflige " +
      degats +
      " dégâts (" +
      efficacite(degats, base) +
      ")"
  );
  tour = tour + 1;
  rendre();

  if (combattants.cible.pv === 0) {
    banniere.textContent = combattants.cible.nom + " est KO";
    banniere.classList.remove("hidden");
    btnAttaque.disabled = true;
  }
}

function recommencer() {
  combattants.attaquant.pv = combattants.attaquant.pvMax;
  combattants.cible.pv = combattants.cible.pvMax;
  tour = 1;
  journal.innerHTML = "";
  banniere.textContent = "";
  banniere.classList.add("hidden");
  btnAttaque.disabled = false;
  rendre();
}

btnAttaque.addEventListener("click", attaquer);
btnRecommencer.addEventListener("click", recommencer);

rendre();
