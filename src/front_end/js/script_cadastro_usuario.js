// Adiciona um evento de clique no ícone do olho para alternar a visibilidade da senha
document.getElementById("toggleSenha").addEventListener("click", function () {
  const campoSenha = document.getElementById("senha_usuario");//campo de senha
  const icone = this;  //this se refere ao icon que recebeu o clique

  if (campoSenha.type === "password") {
    campoSenha.type = "text";  //muda para type="text" para mostrar a senha.
    icone.classList.remove("bxs-show"); //muda para o olho fechado
    icone.classList.add("bxs-hide");
  } else {
    campoSenha.type = "password";    //muda para type="password" para esconder a senha.
    icone.classList.remove("bxs-hide"); //muda para o olho aberto
    icone.classList.add("bxs-show");
  }
});
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
function func_fornecedor() {
};

document.querySelector('.sair').addEventListener('click', async function () {
  
  window.location.href = 'frontend/html/login.html';  // Redireciona para a tela de Licitação

});

/******************************************************************************************************************* */
document.querySelector('.cancelar').addEventListener('click', function () {
    window.history.back();
});

document.querySelector('.form_cadastro').addEventListener('submit', async function (e) {
    e.preventDefault();

    const inputs = e.target.elements;

    const nomeCompleto = inputs[0].value;
    const funcao = inputs[1].value;
    const unidade = inputs[2].value;
    const email = inputs[3].value;
    const senha = inputs[4].value;

    try {
      const response = await fetch("http://localhost:3000/user/cadastro_usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nomeCompleto,
          funcao,
          unidade,
          email,
          senha
        }),
        credentials: "include"
      });
      const dados = await response.json();
  
      Array.from(inputs).forEach(input => {
        if(input.value != "senha123")
          input.value = "";
      });

      if(!response.ok) {
        alert(dados.detail);
      }
      
    } catch (error) {
      console.error(error);
    }
});

/******************************************************************************************************************* */
