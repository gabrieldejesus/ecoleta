//==============================================================ESTADO==============================================================
function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf")
    //Buscar estados
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    //Deu certo então entra no then
    .then( res => res.json() ) //Transformar em json
    //Roda função
    .then( states => {

        for( const state of states ) {
             // pegue vc mesmo e some esse valor
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    } )
}
populateUFs()

//==============================================================CIDADES==============================================================
function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]") // Pegar status

    const ufValue = event.target.value // onde o evento foi executado

    const indexOfSelectedState = event.target.selectedIndex //Qual o número do selected
    stateInput.value = event.target.options[indexOfSelectedState].text // O número selecionado vai aparecer aqui



    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios` // muda o url sempre que o valor for alterado

    
    // limpando o select
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disable = true

    fetch(url)
    //Deu certo então entra no then
    .then( res => res.json() ) //Transformar em json
    //Roda função
    .then( cities => {
        for( const city of cities ) {
             // pegue vc mesmo e some esse valor
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
        //Ativar o select
        citySelect.disabled = false;
    } )

}

document
    .querySelector("select[name=uf")
    .addEventListener("change", getCities) //Passando por referencia

//==========================================================ITEMS DE COLETA==========================================================

//Pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

//para cada um deles
for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}


const collectedItems = document.querySelector("input[name=items")

//quais os items selecionados
let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target

    //adicionar ou remover uma classe com javascript
    itemLi.classList.toggle("selected") //Adicionar ou remover

    const itemId = itemLi.dataset.id


    //verificar se existem itens selecionados, se sim
    //pegar os items selecionados

    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId // isso será true ou false
        return itemFound
    })

    //se já estiver selecionado
    if(alreadySelected >= 0) {
        //tirar da seleção
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })

        selectedItems = filteredItems
    } else {
        //se não estiver selecionado
        //adicionar à seleção
        selectedItems.push(itemId)
    }


    //atualizar o campo escondido com os items selecionados
    collectedItems.value = selectedItems
}