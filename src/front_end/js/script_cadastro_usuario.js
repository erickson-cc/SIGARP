function mostrarSenha() {
  const input = document.getElementById('senha_usuario');
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}
