document.getElementById("toggle_menu").addEventListener("click", function () {
  const menu = document.querySelector(".menu_lateral");
  const icone = this.querySelector("i");
  menu.classList.toggle("reduzido");
  if (menu.classList.contains("reduzido")) {
    icone.classList.remove("bx-menu");
    icone.classList.add("bx-menu-alt-right");
  } else {
    icone.classList.remove("bx-menu-alt-right");
    icone.classList.add("bx-menu");
  }
});

document.querySelector(".usuario_menu").addEventListener("click", function (event) {
  let popup = document.getElementById("popup");
  if (popup.style.display === "block") {
    closePopup();
  } else {
    showPopup();
  }
  event.stopPropagation();
});

document.addEventListener("click", function (event) {
  let popup = document.getElementById("popup");
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

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const numerolic = urlParams.get('numerolic');
    const anolic = urlParams.get('anolic');

    if (!numerolic || !anolic) {
        alert("Número ou ano da licitação não fornecidos para edição.");
        window.history.back(); // Volta para a página anterior
        return;
    }

    // Preencher os campos de NUC e Ano (somente leitura)
    document.getElementById('edit_num_licitacao').value = numerolic;
    document.getElementById('edit_ano_licitacao').value = anolic;

    // Buscar os dados da licitação para preencher o formulário
    try {
        const response = await fetch(`http://localhost:3000/api/licitacoes/${numerolic}/${anolic}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Erro ao carregar dados da licitação: ${errorData.message || response.statusText}`);
            window.history.back();
            return;
        }

        const licitacao = await response.json();
        document.getElementById('edit_descricao_licitacao').value = licitacao.descrlic;

    } catch (error) {
        console.error("Erro ao buscar licitação para edição:", error);
        alert("Erro na comunicação com o servidor ao carregar licitação para edição.");
        window.history.back();
    }

    // Lógica para salvar as alterações
    document.getElementById('form_editar_licitacao').addEventListener('submit', async function (e) {
        e.preventDefault();

        const novaDescricao = document.getElementById('edit_descricao_licitacao').value;

        try {
            const response = await fetch(`http://localhost:3000/api/licitacoes/${numerolic}/${anolic}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ descrlic: novaDescricao }),
                credentials: "include"
            });

            if (response.ok) {
                alert("Licitação atualizada com sucesso!");
                window.location.href = 'http://localhost:3000/consulta_licitacoes'; // Redireciona de volta para a consulta
            } else {
                const errorData = await response.json();
                const errorMessages = errorData.errors ? errorData.errors.map(err => err.msg).join('\n') : errorData.message || response.statusText;
                alert(`Erro ao atualizar licitação:\n${errorMessages}`);
            }
        } catch (error) {
            console.error("Erro na requisição de atualização:", error);
            alert("Erro na comunicação com o servidor ao atualizar licitação.");
        }
    });
});

