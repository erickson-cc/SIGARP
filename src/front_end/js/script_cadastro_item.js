
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
document.querySelector('.btn-gravar').addEventListener('click', function () {
  alert('Salvo com sucesso!');
  window.history.back();
});
