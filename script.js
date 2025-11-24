let baseFilosofia = [];

// 1. Carregar data.json
async function carregarDados() {
  try {
    const resposta = await fetch("data.json");
    baseFilosofia = await resposta.json();
    aplicarFiltros(); // render inicial
  } catch (erro) {
    console.error("Erro ao carregar data.json:", erro);
    document.getElementById("status-lista").textContent =
      "Erro ao carregar os dados.";
  }
}

const inputBusca = document.getElementById("busca");
const selectTipo = document.getElementById("tipo");
const selectPeriodo = document.getElementById("periodo");
const selectNivel = document.getElementById("nivel");
const containerCards = document.getElementById("cards-container");
const statusLista = document.getElementById("status-lista");

// Criar card
function criarCard(item) {
  const card = document.createElement("article");
  card.classList.add("card");

  card.innerHTML = `
    <div class="card-cabecalho">
      <h2 class="card-titulo">${item.nome}</h2>
      <span class="card-tipo">${item.tipo}</span>
    </div>
    <p class="card-meta">${item.periodo} • ${item.escola}</p>
    <p class="card-descricao">${item.descricao}</p>

    <div class="card-tags">
      ${item.tags
        .map((tag) => `<span class="card-tag">${tag}</span>`)
        .join("")}
    </div>

    <p class="card-link">
      <a href="${item.urlReferencia}" target="_blank" rel="noopener noreferrer">
        Ver referência externa
      </a>
    </p>
  `;

  return card;
}

// Renderizar lista
function renderizarLista(lista) {
  containerCards.innerHTML = "";

  if (lista.length === 0) {
    statusLista.textContent = "Nenhum resultado encontrado.";
    return;
  }

  statusLista.textContent = `Exibindo ${lista.length} item(s)`;
  lista.forEach((item) => containerCards.appendChild(criarCard(item)));
}

// Aplicar filtros
function aplicarFiltros() {
  const termo = inputBusca.value.toLowerCase().trim();
  const tipo = selectTipo.value;
  const periodo = selectPeriodo.value;
  const nivel = selectNivel.value;

  const listaFiltrada = baseFilosofia.filter((item) => {
    if (tipo && item.tipo !== tipo) return false;
    if (periodo && item.periodo !== periodo) return false;
    if (nivel && item.nivel !== nivel) return false;

    if (termo) {
      const texto =
        item.nome.toLowerCase() +
        " " +
        item.descricao.toLowerCase() +
        " " +
        item.tags.join(" ").toLowerCase();
      if (!texto.includes(termo)) return false;
    }

    return true;
  });

  renderizarLista(listaFiltrada);
}

// Eventos
inputBusca.addEventListener("input", aplicarFiltros);
selectTipo.addEventListener("change", aplicarFiltros);
selectPeriodo.addEventListener("change", aplicarFiltros);
selectNivel.addEventListener("change", aplicarFiltros);

// Iniciar carregamento
carregarDados();
