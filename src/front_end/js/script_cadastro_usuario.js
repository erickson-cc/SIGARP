document.getElementById("toggleSenha").addEventListener("click", function () {
  const campoSenha = document.getElementById("senha_usuario");
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
document.getElementById("toggle_menu").addEventListener("click", function () {
  const menu = document.querySelector(".menu_lateral");
  const icone = this.querySelector("i");
  
  menu.classList.toggle("reduzido");

  // troca o ícone (se quiser)
  if (menu.classList.contains("reduzido")) {
    icone.classList.remove("bx-menu");
    icone.classList.add("bx-menu-alt-right"); // ícone diferente para indicar recolhido
  } else {
    icone.classList.remove("bx-menu-alt-right");
    icone.classList.add("bx-menu");
  }
});

