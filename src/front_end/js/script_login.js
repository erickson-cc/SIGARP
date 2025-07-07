document.getElementById("toggleSenha").addEventListener("click", function () {
  const campoSenha = document.getElementById("senha");
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

document.getElementById("formLogin").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        senha
      }),
      credentials: "include"
    });

    if(response.ok)
      window.location.href = "http://localhost:3000/cadastro_usuario";
    
  } catch (error) {
    console.error("Erro ao fazer login:", error);
  }
});
