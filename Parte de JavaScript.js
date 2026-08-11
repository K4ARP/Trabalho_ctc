const container = document.getElementById("jogo")

const tab = document.createElement("div")
tab.classList.add("tab")

for (let i = 0; i < 9; i++){
    const quadrado = document.createElement("div");
    quadrado.classList.add("quadrado")
    quadrado.dataset.index = i;

    tab.appendChild(quadrado);
}

container.appendChild(tab);

const indicador_x = document.getElementById("indicando-x");
const indicador_o = document.getElementById("indicando-o");

let jogadorAtual = "x";
const tabuleiro = ["","","","","","","","",""]

tab.addEventListener("click", function(evento) {
    const quadradoClicado = event.target;
    if (!quadradoClicado.classList.contains("quadrado")) {
        return;
    }

    const index = quadradoClicado.dataset.index;

    if (tabuleiro[index] !== "") {
        return;
    }

    tabuleiro[index] = jogadorAtual;
    quadradoClicado.innerHTML = `<img src="${jogadorAtual}.svg" alt="${jogadorAtual}" class="marca">`;

    jogadorAtual = jogadorAtual === "x" ? "o" : "x"

    indicador_x.classList.toggle("ativo", jogadorAtual === "x");
    indicador_o.classList.toggle("ativo", jogadorAtual === "o");


});
