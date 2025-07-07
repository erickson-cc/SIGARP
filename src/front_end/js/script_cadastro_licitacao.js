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
// **********************************************************************************************
// Carregamento dos Dados da Licitação ao abrir a página
window.addEventListener('DOMContentLoaded', function () {
    let licitacoes = JSON.parse(localStorage.getItem('licitacoes')) || {}; // Recupera todas as licitações salvas
    let chave = localStorage.getItem('lic_chave_atual');                   // Recupera a chave da licitação atual

    // Se existir uma licitação selecionada no localStorage
    if (chave && licitacoes[chave]) {
        const licitacao = licitacoes[chave];                               // Recupera os dados dessa licitação

        // Preenche os campos do formulário da licitação
        document.getElementById('num_licitacao').value = licitacao.num_licitacao;
        document.getElementById('ano_licitacao').value = licitacao.ano;
        document.getElementById('descricao_licitacao').value = licitacao.descricao;

        // Preenche a tabela com os lances dessa licitação
        atualizar_tabela_lances(licitacao.lances);
        if (licitacao.lances && licitacao.lances.length > 0) {
            bloquear_campos_licitacao();
        }
    }
});

// **********************************************************************************************
// Função para atualizar a tabela de lances na tela
function atualizar_tabela_lances(lances) {
    const tbody = document.getElementById('tabela_lances').getElementsByTagName('tbody')[0];  // Pega o corpo da tabela
    tbody.innerHTML = '';  // Limpa a tabela antes de preencher

    // Se não houver lances cadastrados, mostra uma mensagem
    if (!lances || lances.length === 0) {
        const tr = tbody.insertRow();          // Cria uma nova linha
        const td = tr.insertCell(0);           // Cria uma célula
        td.colSpan = 4;                        // Faz a célula ocupar todas as colunas
        td.innerText = 'Nenhum lance cadastrado para esta licitação.';  // Mensagem
        return;
    }

    // Filtra os lances para mostrar apenas pares únicos de (num_pregao, cnpj_fornecedor)
    const pares_unicos = [];
    const chaves_encontradas = new Set();
    lances.forEach(lance => {
        const chave = lance.num_pregao + '|' + lance.cnpj_fornecedor; // Chave única por pregão + cnpj
        if (!chaves_encontradas.has(chave)) {
            chaves_encontradas.add(chave);
            pares_unicos.push(lance);
        }
    });

    // Preenche a tabela com os lances únicos
    pares_unicos.forEach(lance => {
        const row = tbody.insertRow();                               // Nova linha
        row.insertCell(0).innerText = lance.num_pregao;              // Coluna Num. Pregão
        row.insertCell(1).innerText = lance.cnpj_fornecedor;         // Coluna CNPJ Fornecedor

        // Botão Visualizar
        const cell_editar = row.insertCell(2);
        const btn_editar = document.createElement('button');
        btn_editar.innerText = 'Editar';
        btn_editar.type = 'button';
        btn_editar.classList.add('btn-editar');
        btn_editar.addEventListener('click', () => {
            // Salva os dados do lance no localStorage para abrir na tela de cadastro de lance
            localStorage.setItem('visualizar_num_pregao', lance.num_pregao);
            localStorage.setItem('visualizar_cnpj_fornecedor', lance.cnpj_fornecedor);
            localStorage.setItem('lic_chave_atual', localStorage.getItem('lic_chave_atual'));
            window.location.href = 'http://localhost:3000/cadastro_lance';          // Redireciona para a tela de cadastro de lance
        });
        cell_editar.appendChild(btn_editar);

        // Botão Excluir
        const cell_excluir = row.insertCell(3);
        const btn_excluir = document.createElement('button');
        btn_excluir.innerText = 'Excluir';
        btn_excluir.classList.add('btn-excluir');
        btn_excluir.addEventListener('click', () => {
            // Remove o lance selecionado
            excluir_lances(lances, lance.num_pregao, lance.cnpj_fornecedor);
        });
        cell_excluir.appendChild(btn_excluir);
    });
}

// **********************************************************************************************
// Função para excluir lances por Pregão e CNPJ

function excluir_lances(lances, num_pregao, cnpj_fornecedor) {
    if (!confirm("Tem certeza que deseja excluir este lance?")) {
        return;  // Se o usuário cancelar, sai da função
    }
    // Filtra os lances, removendo todos que tenham o num_pregao e cnpj selecionados
    const lances_filtrados = lances.filter(lance => !(lance.num_pregao === num_pregao && lance.cnpj_fornecedor === cnpj_fornecedor));

    // Atualiza o objeto de licitações no localStorage
    let licitacoes = JSON.parse(localStorage.getItem('licitacoes')) || {};
    let chave = localStorage.getItem('lic_chave_atual');

    if (chave && licitacoes[chave]) {
        licitacoes[chave].lances = lances_filtrados;                          // Atualiza os lances da licitação
        localStorage.setItem('licitacoes', JSON.stringify(licitacoes));      // Salva de volta no localStorage
    }

    // Atualiza a tabela na tela
    atualizar_tabela_lances(lances_filtrados);
    if (lances_filtrados.length === 0) {
        desbloquear_campos_licitacao();
    }
}
function desbloquear_campos_licitacao() {
    document.getElementById('num_licitacao').readOnly = false;
    document.getElementById('ano_licitacao').readOnly = false;
    document.getElementById('descricao_licitacao').readOnly = false;
}

// **********************************************************************************************
// Evento para o Botão "Adicionar Lance"

document.querySelector('.add_lance').addEventListener('click', function () {
    // Captura os dados preenchidos nos campos da licitação
    const num_licitacao = document.getElementById('num_licitacao').value.trim();
    const ano_licitacao = document.getElementById('ano_licitacao').value.trim();
    const descricao_licitacao = document.getElementById('descricao_licitacao').value.trim();

    // Validação: Se algum campo estiver vazio, exibe alerta e impede continuar
    if (!num_licitacao || !ano_licitacao || !descricao_licitacao) {
        alert('Preencha todos os campos da licitação antes de adicionar lances.');
        return;
    }

    // Recupera todas as licitações salvas no localStorage
    let licitacoes = JSON.parse(localStorage.getItem('licitacoes')) || {};

    // Cria uma chave única no formato "numero_ano", exemplo: "1_2025"
    const chave = `${num_licitacao}_${ano_licitacao}`;

    // Se a licitação ainda não existir, cria uma nova
    if (!licitacoes[chave]) {
        licitacoes[chave] = {
            num_licitacao,
            ano: ano_licitacao,
            descricao: descricao_licitacao,
            lances: []               // Inicializa com lista vazia de lances
        };
    } else {
        // Se já existir, apenas atualiza a descrição (caso o usuário tenha modificado)
        licitacoes[chave].descricao = descricao_licitacao;
    }

    // Salva as licitações atualizadas no localStorage
    localStorage.setItem('licitacoes', JSON.stringify(licitacoes));

    // Define no localStorage qual é a licitação atual
    localStorage.setItem('lic_chave_atual', chave);
        bloquear_campos_licitacao();

    // Redireciona o usuário para a página de cadastro de lance
    window.location.href = 'http://localhost:3000/cadastro_lance';
});
function bloquear_campos_licitacao() {
    document.getElementById('num_licitacao').readOnly = true;
    document.getElementById('ano_licitacao').readOnly = true;
    document.getElementById('descricao_licitacao').readOnly = true;
}

document.addEventListener('DOMContentLoaded', function () {
    const btn_cancelar = document.querySelector('.cancelar');

    if (btn_cancelar) {
        btn_cancelar.addEventListener('click', function () {
            if (confirm("Tem certeza que deseja cancelar?\nTodos os lances desta licitação serão apagados e as alterações não salvas serão perdidas.")) {
                let licitacoes = JSON.parse(localStorage.getItem('licitacoes')) || {};
                let chave = localStorage.getItem('lic_chave_atual');

                if (chave && licitacoes[chave]) {
                    // Limpa todos os lances dessa licitação
                    licitacoes[chave].lances = [];
                    localStorage.setItem('licitacoes', JSON.stringify(licitacoes));
                }

                // Limpa qualquer info de visualização de lance
                localStorage.removeItem('visualizar_num_pregao');
                localStorage.removeItem('visualizar_cnpj_fornecedor');
                localStorage.removeItem('lic_chave_atual');

                // Volta para a tela anterior
                window.location.href = 'http://localhost:3000/cadastro_licitacao';
            }
        });
    } else {
        console.log('Botão CANCELAR não encontrado.');
    }
});
