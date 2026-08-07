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


