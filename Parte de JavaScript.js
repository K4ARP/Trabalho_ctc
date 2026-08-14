/* ===== CRIAÇÃO DO TABULEIRO ===== */
// Pega a div vazia do HTML e monta o grid de 9 quadrados dentro dela via JavaScript
const container = document.getElementById("jogo")

const tab = document.createElement("div")
tab.classList.add("tab")

for (let i = 0; i < 9; i++){
    const quadrado = document.createElement("div");
    quadrado.classList.add("quadrado")
    quadrado.dataset.index = i; // guarda a posição (0 a 8) de cada quadrado

    tab.appendChild(quadrado);
}

container.appendChild(tab);

/* ===== ELEMENTOS DA TELA ===== */
const indicadorX = document.getElementById("indicando-x");
const indicadorO = document.getElementById("indicando-o");

const overlay = document.getElementById("overlay");
const imagemResultado = document.getElementById("imagem-resultado");

const btnRestart = document.getElementById("btn-restart");

const statusJogada = document.getElementById("status-jogada");

// tempo (em milissegundos) que a IA espera antes de jogar, só pra não parecer instantâneo
const TEMPO_ESPERA_IA = 1200;

/* ===== VARIÁVEIS DE CONTROLE DO JOGO ===== */
let jogadorAtual = "x";       // de quem é a vez agora
let jogoAcabou = false;       // trava o jogo quando termina
let dificuldade = null;       // guarda a dificuldade escolhida (facil, medio, dificil)
const tabuleiro = ["", "", "", "", "", "", "", "", ""]; // estado dos 9 espaços

// todas as combinações que fazem alguém vencer (linhas, colunas, diagonais)
const combinacoesVitoria = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

/* ===== VERIFICAÇÃO DE RESULTADO ===== */
// checa se alguém venceu, se deu empate, ou se o jogo continua
function verificarResultado() {
    for (const combinacao of combinacoesVitoria) {
        const [a, b, c] = combinacao;
        if (tabuleiro[a] !== "" && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
            return tabuleiro[a]; // "x" ou "o" venceu
        }
    }
    if (tabuleiro.includes("")) {
        return null; // ainda tem espaço vazio, jogo continua
    }
    return "empate"; // preencheu tudo e ninguém venceu
}

/* ===== FIM DE JOGO ===== */
// mostra a mensagem final (vitória ou empate) e esconde os elementos que não fazem mais sentido
function finalizarJogo(resultado) {
    if (resultado === "empate") {
        imagemResultado.src = "empate.svg";
    } else {
        imagemResultado.src = `vitoria-${resultado}.svg`;
    }
    overlay.classList.add("mostrar");
    indicadorX.classList.add("escondido");
    indicadorO.classList.add("escondido");
    statusJogada.classList.add("escondido");
    jogoAcabou = true;
}

/* ===== FUNÇÕES DE APOIO DA IA ===== */
// retorna as posições vazias onde "jogador" (x ou o) venceria se jogasse ali
function obterJogadasVencedoras(jogador) {
    const jogadas = [];
    for (let i = 0; i < 9; i++) {
        if (tabuleiro[i] === "") {
            tabuleiro[i] = jogador;              // testa a jogada
            if (verificarResultado() === jogador) {
                jogadas.push(i);
            }
            tabuleiro[i] = "";                   // desfaz o teste
        }
    }
    return jogadas;
}

// algoritmo Minimax: simula todas as jogadas futuras possíveis e calcula a pontuação de cada uma
// usado só na dificuldade difícil, faz a IA jogar de forma praticamente perfeita
function minimax(profundidade, ehMaximizando) {
    const resultado = verificarResultado();

    if (resultado === "o") return 10 - profundidade;   // bom pra IA
    if (resultado === "x") return profundidade - 10;   // bom pro jogador
    if (resultado === "empate") return 0;

    if (ehMaximizando) {
        let melhor = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (tabuleiro[i] === "") {
                tabuleiro[i] = "o";
                melhor = Math.max(melhor, minimax(profundidade + 1, false));
                tabuleiro[i] = "";
            }
        }
        return melhor;
    } else {
        let melhor = Infinity;
        for (let i = 0; i < 9; i++) {
            if (tabuleiro[i] === "") {
                tabuleiro[i] = "x";
                melhor = Math.min(melhor, minimax(profundidade + 1, true));
                tabuleiro[i] = "";
            }
        }
        return melhor;
    }
}

// escolhe a melhor jogada possível usando o resultado do minimax
function melhorJogadaMinimax() {
    let melhorPontuacao = -Infinity;
    let melhorIndice = null;

    for (let i = 0; i < 9; i++) {
        if (tabuleiro[i] === "") {
            tabuleiro[i] = "o";
            const pontuacao = minimax(0, false);
            tabuleiro[i] = "";
            if (pontuacao > melhorPontuacao) {
                melhorPontuacao = pontuacao;
                melhorIndice = i;
            }
        }
    }
    return melhorIndice;
}

/* ===== JOGADA DO COMPUTADOR (IA) ===== */
// decide a jogada do computador de acordo com a dificuldade escolhida
function jogadaComputador() {
    if (jogoAcabou) return;

    const posicoesVazias = [];
    for (let i = 0; i < tabuleiro.length; i++) {
        if (tabuleiro[i] === "") posicoesVazias.push(i);
    }

    let escolhida;

    if (dificuldade === "facil") {
        // joga aleatório, mas nunca deixa o jogador vencer se puder evitar
        const jogadasVitoriaJogador = obterJogadasVencedoras("x");
        const opcoes = posicoesVazias.filter(pos => !jogadasVitoriaJogador.includes(pos));
        const listaFinal = opcoes.length > 0 ? opcoes : posicoesVazias;
        escolhida = listaFinal[Math.floor(Math.random() * listaFinal.length)];

    } else if (dificuldade === "medio") {
        // prioridade: 1) vencer se puder  2) bloquear o jogador  3) aleatório
        const jogadasVitoriaComputador = obterJogadasVencedoras("o");
        const jogadasVitoriaJogador = obterJogadasVencedoras("x");

        if (jogadasVitoriaComputador.length > 0) {
            escolhida = jogadasVitoriaComputador[0];
        } else if (jogadasVitoriaJogador.length > 0) {
            escolhida = jogadasVitoriaJogador[0];
        } else {
            escolhida = posicoesVazias[Math.floor(Math.random() * posicoesVazias.length)];
        }

    } else {
        // difícil: usa o minimax, joga sempre a melhor jogada matemática possível
        escolhida = melhorJogadaMinimax();
    }

    // aplica a jogada escolhida no tabuleiro e na tela
    tabuleiro[escolhida] = "o";
    const quadrados = document.querySelectorAll(".quadrado");
    quadrados[escolhida].innerHTML = `<img src="o.svg" alt="o" class="marca">`;

    const resultado = verificarResultado();

    if (resultado === "x" || resultado === "o" || resultado === "empate") {
        finalizarJogo(resultado);
        return;
    }

    // volta o turno pro jogador
    jogadorAtual = "x";
    indicadorX.classList.toggle("ativo", true);
    indicadorO.classList.toggle("ativo", false);
    statusJogada.textContent = "Jogador está jogando agora";
}

/* ===== CLIQUE DO JOGADOR NO TABULEIRO ===== */
tab.addEventListener("click", function(evento) {
    const quadradoClicado = evento.target;

    if (jogoAcabou) return;                                    // jogo já terminou
    if (!quadradoClicado.classList.contains("quadrado")) return; // clique fora de um quadrado
    if (jogadorAtual !== "x") return;                           // não é a vez do jogador

    const index = quadradoClicado.dataset.index;
    if (tabuleiro[index] !== "") return;                        // quadrado já ocupado

    // marca a jogada do jogador
    tabuleiro[index] = "x";
    quadradoClicado.innerHTML = `<img src="x.svg" alt="x" class="marca">`;

    const resultado = verificarResultado();

    if (resultado === "x" || resultado === "o" || resultado === "empate") {
        finalizarJogo(resultado);
        return;
    }

    // passa a vez pro computador
    jogadorAtual = "o";
    indicadorX.classList.toggle("ativo", false);
    indicadorO.classList.toggle("ativo", true);
    statusJogada.textContent = "Computador está jogando agora";

    // espera um pouco antes da IA jogar, pra não parecer instantâneo
    setTimeout(jogadaComputador, TEMPO_ESPERA_IA);
});

/* ===== BOTÃO DE REINICIAR ===== */
// simplesmente recarrega a página, zerando tudo
btnRestart.addEventListener("click", function() {
    location.reload();
});

/* ===== TELA DE ESCOLHA DE DIFICULDADE ===== */
const telaDificuldade = document.getElementById("tela-dificuldade");
const botoesDificuldade = document.querySelectorAll(".btn-dificuldade");

// ao clicar em qualquer botão de dificuldade: guarda a escolha, esconde a tela inicial e mostra o jogo
botoesDificuldade.forEach(function(botao) {
    botao.addEventListener("click", function() {
        dificuldade = botao.dataset.nivel;

        telaDificuldade.classList.add("escondido");

        container.classList.remove("escondido-inicial");
        indicadorX.classList.remove("escondido-inicial");
        indicadorO.classList.remove("escondido-inicial");
        statusJogada.classList.remove("escondido-inicial");
    });
});
