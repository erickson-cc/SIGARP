// Adiciona evento de clique no botão do menu (ícone de "hambúrguer")
document.getElementById("toggle_menu").addEventListener("click", function () {
    const menu = document.querySelector(".menu_lateral"); // Seleciona o menu lateral
    const icone = this.querySelector("i");  // Seleciona o ícone dentro do botão

    menu.classList.toggle("reduzido");// Alterna a classe "reduzido" para abrir/fechar o menu

    // Troca o ícone dependendo do estado do menu
    if (menu.classList.contains("reduzido")) {
        icone.classList.remove("bx-menu");
        icone.classList.add("bx-menu-alt-right"); // ícone diferente para indicar recolhido
    } else {
        icone.classList.remove("bx-menu-alt-right");
        icone.classList.add("bx-menu");
    }
});
// Evento de clique no avatar do usuário (ícone com nome)
document.querySelector(".usuario_menu").addEventListener("click", function (event) {
    let popup = document.getElementById("popup"); // Referência ao pop-up de logout

    // Alterna entre abrir e fechar o pop-up
    if (popup.style.display === "block") {
        closePopup();// Fecha o popup se já estiver aberto
    } else {
        showPopup();// Abre o popup se estiver fechado
    }

    // Impede que o clique no usuário feche o pop-up imediatamente
    event.stopPropagation();
});

// Fecha o popup quando clicar fora dele
document.addEventListener("click", function (event) {
    let popup = document.getElementById("popup");
    // Se o popup estiver aberto e o clique não for dentro dele, fecha o popup
    if (popup.style.display === "block" && !popup.contains(event.target)) {
        closePopup();
    }
});

function showPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

document.querySelector('.sair').addEventListener('click', function () {
    window.location.href = '../html/login.html';
});
/***********************************************************************************************************************************/

let demandas_cadastradas = [];  // Variável global para demandas cadastradas

// Botão adicionar demanda
document.querySelector('.add_demanda').addEventListener('click', () => {

    const nome_item = document.getElementById('nome_item').value.trim(); // Captura as informações dos inputs
    const quantidade_item = document.getElementById('quantidade_item_demanda').value.trim();
    const descricao_demanda = document.getElementById('descricao_demanda').value.trim();

    if (!nome_item || !quantidade_item || !descricao_demanda) { // Validação para que nenhum input fique vazio
        alert('Preencha todos os campos!');
        return;
    }

    const demanda = {     // Cria objeto demanda
        nome_item,
        quantidade_item,
        descricao_demanda
    };

    demandas_cadastradas.push(demanda); // Adiciona a demanda no array global

    // Salva no localStorage para persistência 
    localStorage.setItem('demandas_cadastradas', JSON.stringify(demandas_cadastradas));

    atualizar_tabela_demandas(demandas_cadastradas);

    // Limpa campos para próximo cadastro
    document.getElementById('nome_item').value = '';
    document.getElementById('quantidade_item_demanda').value = '';
    document.getElementById('descricao_demanda').value = '';
});

// Atualiza tabela de demandas
function atualizar_tabela_demandas(demandas) {
    const tbody = document.querySelector('#tabela_demanda tbody');
    tbody.innerHTML = '';

    if (!demandas || demandas.length === 0) {
        const tr = tbody.insertRow();
        const td = tr.insertCell(0);
        td.colSpan = 3;
        td.innerText = 'Nenhuma demanda cadastrada.';

        return;
    }

    demandas.forEach((demanda, index) => { // Cria uma nova linha para cada demanda
        const row = tbody.insertRow();

        row.insertCell(0).innerText = demanda.nome_item;
        row.insertCell(1).innerText = demanda.quantidade_item;
        row.insertCell(2).innerText = demanda.descricao_demanda;

        // Botão excluir
        const cell_excluir = row.insertCell(3);
        const btn_excluir = document.createElement('button');
        btn_excluir.innerText = 'Excluir';
        btn_excluir.classList.add('btn-excluir');
        btn_excluir.addEventListener('click', () => {
            excluir_demanda(index);
        });
        cell_excluir.appendChild(btn_excluir);
    });
}

// Excluir demanda pelo índice
function excluir_demanda(indice) {
    if (!confirm('Deseja realmente excluir esta demanda?')) return;

    demandas_cadastradas.splice(indice, 1);
    localStorage.setItem('demandas_cadastradas', JSON.stringify(demandas_cadastradas));
    atualizar_tabela_demandas(demandas_cadastradas);
}

// Botão cancelar — limpa tudo e desbloqueia campos
document.querySelector('.cancelar').addEventListener('click', () => {
    if (!confirm('Tem certeza que deseja cancelar?\nTodos os dados serão perdidos.')) return;

    demandas_cadastradas = [];
    localStorage.removeItem('demandas_cadastradas');
    atualizar_tabela_demandas(demandas_cadastradas);

    document.getElementById('nome_item').value = '';
    document.getElementById('quantidade_item_demanda').value = '';
    document.getElementById('descricao_demanda').value = '';
});

// Form submit para gravar dados (aqui você pode enviar para backend ou processar)
document.querySelector('.btn-gravar').addEventListener('click', function () {
    // Só grava se houver pelo menos uma demanda cadastrada na tabela
    if (demandas_cadastradas.length === 0) {
        alert('Nenhuma demanda para salvar. Adicione pelo menos uma antes de gravar.');
        return;
    }
    alert('Demandas gravadas com sucesso!');

    demandas_cadastradas = [];
    localStorage.removeItem('demandas_cadastradas');
    atualizar_tabela_demandas(demandas_cadastradas);

    document.getElementById('nome_item').value = '';
    document.getElementById('quantidade_item_demanda').value = '';
    document.getElementById('descricao_demanda').value = '';
});