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

const overlay = document.getElementById("overlay");
const imagemResultado = document.getElementById("imagem-resultado");

let jogadorAtual = "x";
let jogoAcabou = false;
const tabuleiro = ["","","","","","","","",""]

const combinacoesVitoria = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

function verificarResultado(){
    for (const combinacao of combinacoesVitoria){
        const [a,b,c] = combinacao;
        if (tabuleiro[a] !== "" && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]){
            return tabuleiro[a];
        }
    }

    if (tabuleiro.includes("")){
        return null;
    }

    return "Empate"
}

tab.addEventListener("click", function(evento) {
    const quadradoClicado = event.target;

    if (jogoAcabou){
        return;
    }

    if (!quadradoClicado.classList.contains("quadrado")) {
        return;
    }

    const index = quadradoClicado.dataset.index;

    if (tabuleiro[index] !== "") {
        return;
    }

    tabuleiro[index] = jogadorAtual;
    quadradoClicado.innerHTML = `<img src="${jogadorAtual}.svg" alt="${jogadorAtual}" class="marca">`;
    
    const resultado = verificarResultado();

    if (resultado === "x" || resultado === "o"){
        imagemResultado.src = `vitoria-${resultado}.svg`;
        overlay.classList.add("mostrar")
        jogoAcabou = true;
        return;
    }

    if (resultado === "Empate"){
        imagemResultado.src = "empate.svg";
        overlay.classList.add("mostrar")
        jogoAcabou = true;
        return;
    }

    jogadorAtual = jogadorAtual === "x" ? "o" : "x"

    indicador_x.classList.toggle("ativo", jogadorAtual === "x");
    indicador_o.classList.toggle("ativo", jogadorAtual === "o");


});

