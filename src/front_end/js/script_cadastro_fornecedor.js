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

	const nomeforn = inputs.nome_fornecedor.value;
	const cnpjforn = inputs.cnpj_fornecedor.value;
	const nomerepr = inputs.nome_representante_fornecedor.value;
	const cpfrepr = inputs.cpf_representante_fornecedor.value;
	const idrepr = inputs.rg_representante_fornecedor.value;
	const logradouroforn = inputs.logadouro_fornecedor.value;
	const bairroforn = inputs.bairro_fornecedor.value;
	const numendrforn = inputs.numero_end_fornecedor.value;
	const cepforn = inputs.cep_fornecedor.value;
	const cidadeforn = inputs.cidade_fornecedor.value;
	const ufforn = inputs.uf_fornecedor.value; // Note: o ID é 'uf_unidade' no HTML, mas é para o fornecedor

    try {
      const response = await fetch("http://localhost:3000/user/cadastro_fornecedor_rota", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
		nomeforn,
		cnpjforn,
		nomerepr,
		cpfrepr,
		idrepr,
		logradouroforn,
		bairroforn,
		numendrforn,
		cepforn,
		cidadeforn,
		ufforn
        }),
        credentials: "include"
      });
      const dados = await response.json();
  
      if(!response.ok) {
		const errorMessages = dados.errors ? dados.errors.map(err => err.msg).join('\n') : dados.error || dados.status;
		alert(dados.status);
      }else {
            alert("Fornecedor gravado com sucesso!");
            // Limpar os campos após o sucesso
            Array.from(inputs).forEach(input => {
                input.value = "";
            });
      }
    //  Array.from(inputs).forEach(input => {
    //      input.value = "";
    //  });
    } catch (error) {
	console.error(error);
	alert("Erro na comunicação com o servidor.");
    }
});

