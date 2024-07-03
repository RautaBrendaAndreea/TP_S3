// On récupère le bouton
let backToTop = document.getElementById("backToTop");

// On choisit le moment où le bouton va apparaître
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
  console.log("Scroll Function Fired");
}

// Quand l'utilisateur clique sur le bouton, on le ramène en haut de la page
function topFunction() {
  document.documentElement.scrollTop = 0;
}
