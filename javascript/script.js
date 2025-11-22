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

    const codReg = Date.now();
    const dataReg = document.getElementById('extrato-data').value;
    const descReg = document.getElementById('descricao-form').value;
    const categReg = document.getElementById('extrato-categ');
    const tipoReg = document.getElementById('extrato-tipo');
    const inputValor = document.getElementById('valor-form');

    const valorReg = parseFloat(
        inputValor.value
            .replace('R$', '')
            .replace(/\s/g, '')
            .replace(',', '.')
    ) || 0;


    if (!dataReg || !descReg || valorReg <= 0) {
        alert('Por favor, insira valores válidos!');
        return;
    }

    const novoRegistro = {
        codigo: codReg,
        data: dataReg,
        descricao: descReg,
        categoria: categReg.options[categReg.selectedIndex].text,
        tipo: tipoReg.options[tipoReg.selectedIndex].text,
        valor: valorReg
    }

    transacoes.push(novoRegistro);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transacoes));

    formAddReg.reset();
    document.querySelector('.popup-form-add').style.display = "none";
    renderTable();
})

function renderTable() {
    const tableBody = document.querySelector('.extrato table tbody');
    tableBody.innerHTML = '';

    let currentBalance = 0;

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