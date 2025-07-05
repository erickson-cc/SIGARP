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
        window.location.href = '../login';  // Redireciona para a tela de Licitação

});
// **************************************************************************************************
// Variáveis Globais
let licitacoes = JSON.parse(localStorage.getItem('licitacoes')) || {};  // Recupera todas as licitações salvas
let chave = localStorage.getItem('lic_chave_atual');                    // Recupera a chave da licitação atual
let lances_cadastrados = [];                                             // Array para armazenar os lances da tela atual

// Ao carregar a página (quando o DOM estiver pronto)
window.addEventListener('DOMContentLoaded', () => {
    const num_pregao = localStorage.getItem('visualizar_num_pregao');
    const cnpj_fornecedor = localStorage.getItem('visualizar_cnpj_fornecedor');
    const chave_licitacao = localStorage.getItem('lic_chave_atual');

    // Se veio de uma tela de visualização de lance
    if (num_pregao && cnpj_fornecedor) {
        document.getElementById('num_pregao').value = num_pregao;
        document.getElementById('cnpj_fornecedor').value = cnpj_fornecedor;
        document.getElementById('num_pregao').readOnly = true;             // Bloqueia edição dos campos
        document.getElementById('cnpj_fornecedor').readOnly = true;
    } else {
        // Se veio de uma nova licitação, deixa os campos liberados
        document.getElementById('num_pregao').readOnly = false;
        document.getElementById('cnpj_fornecedor').readOnly = false;
    }

    const licitacoes = JSON.parse(localStorage.getItem('licitacoes')) || {};
    const licitacao = licitacoes[chave_licitacao];

    if (!licitacao || !licitacao.lances) {
        alert('Licitação ou lances não encontrados.');
        return;
    }

    // Filtra os lances existentes para exibir apenas os que têm esse pregão e CNPJ
    const lances_filtrados = licitacao.lances.filter(lance =>
        lance.num_pregao === num_pregao && lance.cnpj_fornecedor === cnpj_fornecedor
    );

    lances_cadastrados = lances_filtrados; // Salva os lances filtrados para manipulação futura
    atualizar_tabela_lances(lances_filtrados, licitacao, chave_licitacao);
});

// *************************************************************************************************
// Evento: Cadastrar um novo item de lance
document.querySelector('.add_item').addEventListener('click', function () {
    // Captura os dados dos campos da tela
    const num_pregao = document.getElementById('num_pregao').value.trim();
    const cnpj_fornecedor = document.getElementById('cnpj_fornecedor').value.trim();
    const nome_item = document.getElementById('nome_item').value.trim();
    const quantidade_item = document.getElementById('quantidade_item').value.trim();
    const valor_unit_item = document.getElementById('valor_unit_item').value.trim();
    const descricao_lance = document.getElementById('descricao_lance').value.trim();

    // Validação: impede salvar se algum campo estiver vazio
    if (num_pregao && cnpj_fornecedor && nome_item && quantidade_item && valor_unit_item && descricao_lance) {
        const lance = {
            num_pregao,
            cnpj_fornecedor,
            nome_item,
            quantidade_item,
            valor_unit_item,
            descricao_lance
        };

        lances_cadastrados.push(lance);                     // Adiciona o novo lance ao array local
        licitacoes[chave].lances.push(lance);               // Adiciona o novo lance ao localStorage
        localStorage.setItem('licitacoes', JSON.stringify(licitacoes)); // Salva alterações

        atualizar_tabela_lances(lances_cadastrados, licitacoes[chave], chave); // Atualiza a tabela

        // Após o primeiro lance, bloqueia os campos num_pregao e cnpj
        if (!document.getElementById('num_pregao').readOnly) {
            document.getElementById('num_pregao').readOnly = true;
            document.getElementById('cnpj_fornecedor').readOnly = true;
        }

        // Limpa os campos dos itens para o próximo cadastro
        document.getElementById('nome_item').value = '';
        document.getElementById('quantidade_item').value = '';
        document.getElementById('valor_unit_item').value = '';
        document.getElementById('descricao_lance').value = '';
    } else {
        alert('Preencha todos os campos!');
    }
});

// *************************************************************************************************
// Função: Atualiza a tabela de lances na tela
function atualizar_tabela_lances(lances, licitacao_completa, chave_licitacao) {
    const tbody = document.getElementById('tabela_itens').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';   // Limpa o conteúdo atual da tabela

    // Caso não existam lances
    if (!lances || lances.length === 0) {
        const tr = tbody.insertRow();
        const td = tr.insertCell(0);
        td.colSpan = 7;   // Número total de colunas da tabela
        td.innerText = 'Nenhum lance cadastrado para esta seleção.';
        return;
    }

    // Para cada lance, cria uma nova linha na tabela
    lances.forEach((lance, index) => {
        const row = tbody.insertRow();

        row.insertCell(0).innerText = lance.num_pregao;
        row.insertCell(1).innerText = lance.cnpj_fornecedor;
        row.insertCell(2).innerText = lance.nome_item || '';
        row.insertCell(3).innerText = lance.quantidade_item || '';
        row.insertCell(4).innerText = lance.valor_unit_item || '';
        row.insertCell(5).innerText = lance.descricao_lance || '';

        // Coluna: Botão Excluir
        const cell_excluir = row.insertCell(6);
        const btn_excluir = document.createElement('button');
        btn_excluir.innerText = 'Excluir';
        btn_excluir.classList.add('btn-excluir');
        btn_excluir.onclick = function () {
            excluir_lance(lance, licitacao_completa, chave_licitacao);
        };
        cell_excluir.appendChild(btn_excluir);
    });
}

// *************************************************************************************************
// Função: Excluir um lance específico
function excluir_lance(lance, licitacao_completa, chave_licitacao) {
    if (!confirm("Tem certeza que deseja excluir este lance?")) {
        return;  // Se o usuário cancelar, sai da função
    }
    // Remove o lance exato da lista de lances
    licitacao_completa.lances = licitacao_completa.lances.filter(l => l !== lance);
    licitacoes[chave_licitacao] = licitacao_completa;   // Atualiza no objeto de licitações
    localStorage.setItem('licitacoes', JSON.stringify(licitacoes));  // Salva no localStorage

    // Filtra novamente os lances daquele pregão + cnpj
    const lances_filtrados = licitacao_completa.lances.filter(l =>
        l.num_pregao === lance.num_pregao && l.cnpj_fornecedor === lance.cnpj_fornecedor
    );

    atualizar_tabela_lances(lances_filtrados, licitacao_completa, chave_licitacao);  // Atualiza a tabela

    // Se não houver mais lances desse pregão + cnpj, desbloqueia os campos
    if (lances_filtrados.length === 0) {
        document.getElementById('num_pregao').readOnly = false;
        document.getElementById('cnpj_fornecedor').readOnly = false;
        document.getElementById('num_pregao').value = '';
        document.getElementById('cnpj_fornecedor').value = '';
    }
}

// *************************************************************************************************
// Evento: Botão "Gravar" (Salvar os lances e voltar para tela de Licitação)
document.querySelector('.btn-gravar').addEventListener('click', function () {
    if (lances_cadastrados.length === 0) {                   // Validação: impede salvar se não houver lances
        alert('Nenhum lance para salvar.');
        return;
    }

    alert('Lances salvos com sucesso!');

    lances_cadastrados = [];                                 // Limpa a lista local
    atualizar_tabela_lances([], licitacoes[chave], chave);     // Limpa a tabela da tela
    localStorage.removeItem('visualizar_num_pregao');        // Limpa o estado de visualização
    localStorage.removeItem('visualizar_cnpj_fornecedor');

    window.location.href = '../cadastro_licitacao';  // Redireciona para a tela de Licitação
});

// *************************************************************************************************
// Evento: Botão "Cancelar" (Voltar para tela anterior)
document.querySelector('.cancelar').addEventListener('click', function () {
    if (!confirm("Tem certeza que deseja voltar a pagina anterior?\nAs alterações realizadas não serão gravadas")) {
        return;  // Se o usuário cancelar, sai da função
    }
    lances_cadastrados = [];                                 // Limpa a lista local
    atualizar_tabela_lances([], licitacoes[chave], chave);     // Limpa a tabela da tela
    localStorage.removeItem('visualizar_num_pregao');        // Limpa o estado de visualização
    localStorage.removeItem('visualizar_cnpj_fornecedor');
    window.history.back();
});
