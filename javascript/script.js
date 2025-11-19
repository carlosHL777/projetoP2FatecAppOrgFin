// função do menu lateral
const itemMenu = document.querySelectorAll('.item-menu')

function selectLink(){
    itemMenu.forEach((item)=>
        item.classList.remove('ativo')
    )
    this.classList.add('ativo')
}

itemMenu.forEach((item)=>
    item.addEventListener('click', selectLink)
)

const btnExpandir = document.querySelector('#bt-exp')
const menuLat = document.querySelector('.menu-lateral')
const conteudoMain = document.querySelector('.main-content')

btnExpandir.addEventListener('click', function () {
    menuLat.classList.toggle('expandir');
    conteudoMain.classList.toggle('expandir');
})

// função para abrir formulário de gastos

const btnAbrirFormAdd = document.querySelector('.btn-add-gastos');
const btnFecharFormAdd = document.querySelector('.btn-fechar-form');

btnAbrirFormAdd.addEventListener("click", function(){
    document.querySelector('.popup-form-add').style.display = "flex"
});

btnFecharFormAdd.addEventListener("click", function(){
    document.querySelector('.popup-form-add').style.display = "none";
})