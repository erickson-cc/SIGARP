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
	const data = await response.json(); // parsear a resposta json
    if(response.ok) {
	  if (data.redirectUrl) {
		window.location.href = data.redirectUrl; // Redireciona para a URL fornecida pelo servidor
      } else {
        // Caso o servidor não envie redirectUrl, mas o login foi OK (situação inesperada, mas tratada)
		alert("Login bem-sucedido, mas sem URL de redirecionamento.");
	      }
	  } else {
		alert(`Erro no login: ${data.status || "Credenciais inválidas."}`);
	  }
      //window.location.href = "http://localhost:3000/cadastro_usuario";
    
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Erro na comunicação com o servidor. Tente novamente.");
  }
});
