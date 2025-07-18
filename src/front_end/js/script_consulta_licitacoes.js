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

function logout() {
  window.location.href = '../login';
}

/*******************************************************************************************************************/

let lista_de_licitacoes = [];

// Função para buscar as licitações do backend
async function buscarLicitacoes() {
    try {
        const response = await fetch("http://localhost:3000/consulta_licitacoes_rota", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Erro ao carregar licitações: ${errorData.message || response.statusText}`);
            return [];
        }

        const licitacoes = await response.json();
        lista_de_licitacoes = licitacoes;
        renderizarLicitacoes(lista_de_licitacoes);
        return licitacoes;
    } catch (error) {
        console.error("Erro na comunicação com o servidor ao buscar licitações:", error);
        alert("Erro ao conectar com o servidor para buscar licitações.");
        return [];
    }
}

// Função para renderizar as licitações na tabela
function renderizarLicitacoes(licitacoesParaRenderizar) {
    const tabelaCorpo = document.getElementById("tabela_licitacoes_corpo");
    tabelaCorpo.innerHTML = "";

    if (licitacoesParaRenderizar.length === 0) {
        tabelaCorpo.innerHTML = '<tr><td colspan="4">Nenhuma licitação encontrada.</td></tr>';
        return;
    }

    licitacoesParaRenderizar.forEach(licitacao => {
        const row = tabelaCorpo.insertRow();
        row.insertCell(0).textContent = licitacao.numerolic;
        row.insertCell(1).textContent = licitacao.anolic;
        row.insertCell(2).textContent = licitacao.descrlic;

        const acoesCell = row.insertCell(3);
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn-acao", "btn-editar");
        //  Passando numerolic e anolic para identificar a licitação
        //btnEditar.onclick = () => editarLicitacao(licitacao.numerolic, licitacao.anolic);
	btnEditar.onclick = () => window.location.href = `http://localhost:3000/editar_licitacao?numerolic=${licitacao.numerolic}&anolic=${licitacao.anolic}`;

        acoesCell.appendChild(btnEditar);

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.classList.add("btn-acao", "btn-remover");
        //  Passando numerolic e anolic para identificar a licitação
        btnRemover.onclick = () => removerLicitacao(licitacao.numerolic, licitacao.anolic);
        acoesCell.appendChild(btnRemover);
    });
}

// Função para lidar com a pesquisa
document.getElementById("form_consulta_licitacoes").addEventListener("submit", function (event) {
    event.preventDefault();

    const termoPesquisa = document.getElementById("barra_de_consulta").value.toLowerCase();
    const licitacoesFiltradas = lista_de_licitacoes.filter(licitacao => {
        return licitacao.numerolic.toString().includes(termoPesquisa) ||
               licitacao.anolic.toString().includes(termoPesquisa) ||
               licitacao.descrlic.toLowerCase().includes(termoPesquisa);
    });
    renderizarLicitacoes(licitacoesFiltradas);
});

// Funções de placeholder para Editar e Remover
//function editarLicitacao(numerolic, anolic) {
    //alert(`Funcionalidade de Editar para a licitação Número: ${numerolic}, Ano: ${anolic} será implementada aqui.`);
//}

async function removerLicitacao(numerolic, anolic) {
	if (confirm(`Tem certeza que deseja remover a licitação Número: ${numerolic}, Ano: ${anolic}?`)) {
        try {
            const response = await fetch(`http://localhost:3000/crud/licitacoes/${numerolic}/${anolic}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include" 
            });

            if (response.status === 204) {
                alert(`Licitação Número: ${numerolic}, Ano: ${anolic} removida com sucesso!`);
                buscarLicitacoes(); // função para recarregar a lista para atualizar a tabela
            } else {
                const errorData = await response.json();
                alert(`Erro ao remover licitação: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de exclusão de licitação:", error);
            alert("Erro na comunicação com o servidor ao remover licitação.");
        }
    }
}

// Carrega as licitações quando a página é carregada
document.addEventListener("DOMContentLoaded", buscarLicitacoes);
