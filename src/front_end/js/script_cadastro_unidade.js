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

document.querySelector('.cancelar').addEventListener('click', function () {
  window.history.back();
});

/*******************************************************************************************************************/

document.querySelector('.form_cadastro').addEventListener('submit', async function (e) {
    e.preventDefault();

    const inputs = e.target.elements;

    const nome_unidade = inputs[0].value;
    const cod_unidade = inputs[1].value;
    const nome_diretor_unidade = inputs[2].value;
    const telefone_unidade = inputs[3].value;
    const tipo_unidade = inputs[4].value;
    const logadouro_unidade = inputs[5].value;
    const bairro_unidade = inputs[6].value;
    const numero_end_unidade = inputs[7].value;
    const cidade_unidade = inputs[8].value;
    const cep_unidade = inputs[9].value;
    
    try {
      const response = await fetch("http://localhost:3000/user/cadastro_unidade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome_unidade,
          cod_unidade, 
          nome_diretor_unidade,
          telefone_unidade,
          tipo_unidade,
          logadouro_unidade,
          bairro_unidade,
          numero_end_unidade,
          cidade_unidade,
          cep_unidade
        }),
        credentials: "include"
      });
      const dados = await response.json();
  
      if(!response.ok) {
        alert(dados.status);
      }
      Array.from(inputs).forEach(input => {
          input.value = "";
      });
    } catch (error) {
      console.error(error);
    }
});

