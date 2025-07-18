document.getElementById("toggle_menu").addEventListener("click", function () {
  const menu = document.querySelector(".menu_lateral"); // Seleciona o menu lateral
  const icone = this.querySelector("i");  // Seleciona o ícone dentro do botão

  menu.classList.toggle("reduzido");// Alterna a classe "reduzido" para abrir/fechar o menu

  if (menu.classList.contains("reduzido")) {
    icone.classList.remove("bx-menu");
    icone.classList.add("bx-menu-alt-right"); // ícone diferente para indicar recolhido
  } else {
    icone.classList.remove("bx-menu-alt-right");
    icone.classList.add("bx-menu");
  }
});
document.querySelector(".usuario_menu").addEventListener("click", function (event) {
  let popup = document.getElementById("popup"); // Referência ao pop-up de logout

  if (popup.style.display === "block") {
    closePopup();
  } else {
    showPopup();
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
function processaResultado(response){
	console.log("Inclusão do item com sucesso", response.data);
	alert("Item gravado com sucesso");
}
function processErrors(error){
	console.error("Ocorreu um erro: ", error.response ? error.response.data : error.message);
	alert("Erro ao gravar o item");
}

$("#btn_gravar_item").click(function(){
	event.preventDefault();
	createPost_item();
	}
);
function createPost_item(){
	const data = {
		nuc: $("#nuc_item").val(),
		nomeitem: $("#nome_item").val()
	}
	if (!data.nuc || !data.nomeitem) {
		alert("Por favor, preencha todos os campos do item.");
		return;
	}
	axios.post("http://localhost:3000/cadastro_item_rota", data)
		.then(processaResultado)
		.catch(processErrors);
}
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

    const nuc_item = inputs[0].value;
    const nome_item = inputs[1].value;
    
    try {
      const response = await fetch("http://localhost:3000/user/cadastro_item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nuc_item,
          nome_item
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

