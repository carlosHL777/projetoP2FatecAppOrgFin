// função do menu lateral
const itemMenu = document.querySelectorAll('.item-menu')

function selectLink() {
    itemMenu.forEach((item) =>
        item.classList.remove('ativo')
    )
    this.classList.add('ativo')
}

itemMenu.forEach((item) =>
    item.addEventListener('click', selectLink)
)

const btnExpandir = document.querySelector('#bt-exp')
const menuLat = document.querySelector('.menu-lateral')
const conteudoMain = document.querySelector('.main-content')

btnExpandir.addEventListener('click', function () {
    menuLat.classList.toggle('expandir');
    conteudoMain.classList.toggle('expandir');
})

// função para abrir e fechar formulário de gastos

const btnAbrirFormAdd = document.querySelector('.btn-add-gastos');
const btnFecharFormAdd = document.querySelector('.btn-fechar-form');

btnAbrirFormAdd.addEventListener("click", function () {
    document.querySelector('.popup-form-add').style.display = "flex"
});

btnFecharFormAdd.addEventListener("click", function () {
    document.querySelector('.popup-form-add').style.display = "none";
})

// função para salvar registro no localstorage
let transacoes = [];
const STORAGE_KEY = 'financialTrackerTransactions';

// função para salvar itens do formulário

const formAddReg = document.querySelector('.form-add-mov');

formAddReg.addEventListener('submit', (e) => {
    e.preventDefault();

    
    const dataReg = document.getElementById('extrato-data').value;
    const descReg = document.getElementById('descricao-form').value;
    const categReg = document.getElementById('extrato-categ');
    const tipoReg = document.getElementById('extrato-tipo');
    const inputValor = document.getElementById('valor-form');

    const valorReg = parseFloat(
        inputValor.value.replace('R$', '').replace(/\s/g, '').replace(',', '.')
    ) || 0;

    if (!dataReg || !descReg || valorReg <= 0) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const novoRegistro = {
        codigo: Date.now(), 
        data: dataReg,
        descricao: descReg,
        categoria: categReg.options[categReg.selectedIndex].text,
        tipo: tipoReg.options[tipoReg.selectedIndex].text,
        valor: valorReg
    };

    fetch('salvar_transacao.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoRegistro)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            
            transacoes.push(novoRegistro);
            renderTable(); 
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transacoes));
            
            formAddReg.reset();
            document.querySelector('.popup-form-add').style.display = "none";
            alert('Registro salvo com sucesso!');
        } else {
            alert('Erro no servidor: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor. Verifique se o USBWebserver está ligado.');
    });
});    
function renderTable() {
    const tableBody = document.querySelector('.extrato table tbody');
    tableBody.innerHTML = '';

    let currentBalance = 0;

    if (transacoes.length === 0) {
        const emptyRow = tableBody.insertRow();
        const emptyCell = emptyRow.insertCell();
        emptyCell.colSpan = 8;
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '2rem';

        const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#97959556" class="bi bi-card-list" viewBox="0 0 16 16">
            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
            <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
            </svg>`
        ;
        
        const imgSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgMarkup)}`;

        const emptyContent = document.createElement('div');
        emptyContent.className = 'empty-state';
        emptyContent.style.display = 'inline-block';
        emptyContent.style.maxWidth = '100%';
        emptyContent.style.textAlign = 'center';

        const emptyImage = document.createElement('img');
        emptyImage.src = imgSrc;
        emptyImage.alt = 'Nenhum registro encontrado';
        emptyImage.style.maxWidth = '220px';
        emptyImage.style.width = '100%';
        emptyImage.style.height = 'auto';
        emptyImage.style.marginBottom = '1rem';

        const message = document.createElement('p');
        message.textContent = 'Nenhum registro encontrado. Adicione sua primeira transação!';
        message.style.margin = '0';
        message.style.color = '#666';
        message.style.fontSize = '0.95rem';

        emptyContent.appendChild(emptyImage);
        emptyContent.appendChild(message);
        emptyCell.appendChild(emptyContent);

        const saldoAtualUserElement = document.getElementById('saldo-atual-user');
        const saldoFormatado = currentBalance.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        saldoAtualUserElement.textContent = saldoFormatado;
        saldoAtualUserElement.style.color = '#2A9D8F';

        return;
    }

    transacoes.forEach(t => {
        const amount = t.valor;
        const isGasto = t.tipo === 'Gasto';

        if (isGasto) {
            currentBalance -= amount;
        } else {
            currentBalance += amount;
        }

        const saldoAtualUserElement = document.getElementById('saldo-atual-user');
        const saldoFormatado = currentBalance.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        saldoAtualUserElement.textContent = saldoFormatado;
        saldoAtualUserElement.style.color = currentBalance >= 0 ? '#2A9D8F' : '#E76F51';

        const newRow = tableBody.insertRow();

        newRow.insertCell().textContent = t.codigo;
        newRow.insertCell().textContent = t.data;
        newRow.insertCell().textContent = t.descricao;

        const typeCell = newRow.insertCell();
        typeCell.textContent = t.tipo;
        typeCell.classList.add(isGasto ? 'text-gasto' : 'text-renda');
        typeCell.style.color = isGasto ? '#ee2626ff' : '#31c931ff';

        newRow.insertCell().textContent = t.categoria;

        const valorCell = newRow.insertCell();

        const valorFormatadoBRL = amount.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).replace('R$', '');

        let valorComSinal;
        if (isGasto) {
            valorComSinal = `- ${valorFormatadoBRL}`;
            valorCell.style.color = '#df0a0a';
        } else {
            valorComSinal = `+ ${valorFormatadoBRL}`;
            valorCell.style.color = '#0de40d';
        }
        valorCell.textContent = valorComSinal;


        const balanceCell = newRow.insertCell();
        balanceCell.textContent = currentBalance.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        balanceCell.style.color = currentBalance >= 0 ? '#2A9D8F' : '#E76F51';

        const actionsCell = newRow.insertCell();

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.className = 'btn-action btn-remove';
        removeBtn.dataset.codeRem = t.codigo;
        actionsCell.appendChild(removeBtn);


    });
}

function removeRegistro(codigoParaRemover) {

    const codigo = Number(codigoParaRemover);

    const initialLength = transacoes.length;
    transacoes = transacoes.filter(t => t.codigo !== codigo);

    if (transacoes.length < initialLength) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transacoes));
        renderTable();
        alert('Registro removido com sucesso!');
    } else {
        alert('Erro: Registro não encontrado.');
    }
}

const tableBody = document.querySelector('.extrato table tbody');

tableBody.addEventListener('click', (e) => {

    if (e.target.classList.contains('btn-remove')) {

        const codigo = e.target.dataset.codeRem;

        if (confirm('Tem certeza que deseja remover este registro permanentemente?')) {

            removeRegistro(codigo);
        }
    }
});

function loadTransactions() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {

        transacoes = JSON.parse(storedData);
    }

    renderTable();
}

loadTransactions();