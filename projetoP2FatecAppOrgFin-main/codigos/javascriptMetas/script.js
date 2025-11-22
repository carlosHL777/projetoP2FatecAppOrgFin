 
 function abrirModalFoto() {
  document.getElementById("modalFoto").style.display = "block";
}

function fecharModalFoto() {
  document.getElementById("modalFoto").style.display = "none";
}

function salvarFotoUsuario() {
  const url = document.getElementById("urlFotoPerfil").value;
  if (url) {
    document.getElementById("fotoUsuario").src = url;
    document.getElementById("fotoUsuario").style.display = "block";
    document.getElementById("fotoPadrao").style.display = "none";
  }
  fecharModalFoto();
}

function removerFotoUsuario() {
  document.getElementById("fotoUsuario").src = "";
  document.getElementById("fotoUsuario").style.display = "none";
  document.getElementById("fotoPadrao").style.display = "flex";
}


    const metas = [];
    let editandoIndex = null;

    function abrirModal(index = null) {
      editandoIndex = index;

      if (index !== null) {
        const meta = metas[index];
        document.getElementById("modal-title").innerText = "Editar Meta";
        document.getElementById("nome").value = meta.nome;
        document.getElementById("descricao").value = meta.descricao;
        document.getElementById("valorTotal").value = meta.valorTotal;
        document.getElementById("valorAtual").value = meta.valorAtual;
        document.getElementById("iconeURL").value = meta.iconeURL;
      } else {
        document.getElementById("modal-title").innerText = "Nova Meta";
        document.getElementById("nome").value = "";
        document.getElementById("descricao").value = "";
        document.getElementById("valorTotal").value = "";
        document.getElementById("valorAtual").value = "";
        document.getElementById("iconeURL").value = "";
      }

      document.getElementById("modal").style.display = "block";
    }

    function fecharModal() {
      document.getElementById("modal").style.display = "none";
    }

    function salvarMeta() {
      const nome = document.getElementById("nome").value;
      const descricao = document.getElementById("descricao").value;
      const valorTotal = parseFloat(document.getElementById("valorTotal").value);
      const valorAtual = parseFloat(document.getElementById("valorAtual").value);
      const iconeURL = document.getElementById("iconeURL").value;
      const progresso = Math.min((valorAtual / valorTotal) * 100, 100);

      const novaMeta = { nome, descricao, valorTotal, valorAtual, progresso, iconeURL };

      if (editandoIndex !== null) {
        metas[editandoIndex] = novaMeta;
      } else {
        metas.push(novaMeta);
      }

      fecharModal();
      renderizarMetas();
    }

    function removerMeta(index) {
      metas.splice(index, 1);
      renderizarMetas();
    }

    function adicionarImagem(index) {
      abrirModal(index);
    }

    function renderizarMetas() {
      const container = document.getElementById("metas");
      container.innerHTML = "";

      metas.forEach((meta, index) => {
        const card = document.createElement("div");
        card.className = "meta-card";

        let imagemHTML = meta.iconeURL
          ? `<img src="${meta.iconeURL}" alt="Ícone da meta">`
          : `<div class="meta-img" onclick="adicionarImagem(${index})">+</div>`;

        card.innerHTML = `
          ${imagemHTML}
          <h3>${meta.nome}</h3>
          <p>${meta.descricao}</p>
          <p>Guardado: R$${meta.valorAtual} / R$${meta.valorTotal}</p>
          <div class="progress-bar">
            <div class="progress" style="width:${meta.progresso}%"></div>
          </div>
          <div class="action-buttons">
            <button class="edit-btn" onclick="abrirModal(${index})">Editar</button>
            <button class="remove-btn" onclick="removerMeta(${index})">Remover</button>
          </div>
        `;

        container.appendChild(card);
      });
    }
    // Seleciona todos os itens do menu
const itemMenu = document.querySelectorAll('.item-menu');

function selectLink() {
  itemMenu.forEach((item) => item.classList.remove('ativo'));
  this.classList.add('ativo');
}

// Adiciona evento de clique em cada item
itemMenu.forEach((item) => item.addEventListener('click', selectLink));

// Botão de expandir/recolher
const btnExpandir = document.querySelector('#bt-exp');
const menuLat = document.querySelector('.menu-lateral');

btnExpandir.addEventListener('click', function () {
  menuLat.classList.toggle('expandir');
});
