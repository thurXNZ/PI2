document.addEventListener('DOMContentLoaded', function () {
  const modalCompra = new bootstrap.Modal(document.getElementById('modal-compra'));
  const nomeIngresso = document.getElementById("nome-ingresso");
  const valorIngresso = document.getElementById("valor-ingresso");
  const quantidadeInput = document.getElementById("quantidade");
  const valorTotalElement = document.getElementById("valor-total");
  const IDUsuario = localStorage.getItem('IDUsuario');
  const accessToken = localStorage.getItem('accessToken');

  let precoUnitario = 0;

  document.querySelectorAll('.btn-comprar').forEach(button => {
    button.addEventListener('click', function () {
      precoUnitario = parseFloat(this.getAttribute('data-preco'));
      const tituloIngresso = this.getAttribute('data-titulo');
      const ingressoId = this.getAttribute('data-id');

      nomeIngresso.textContent = tituloIngresso;
      valorIngresso.textContent = `R$ ${precoUnitario.toFixed(2)}`;
      document.getElementById('ingresso-id').value = ingressoId;
      calcularValorTotal();
      modalCompra.show();
    });
  });

  function showCustomAlert(message, type) {
    var alertBox = document.getElementById('customAlert');
    alertBox.textContent = message;

    if (type === 'success') {
      alertBox.classList.remove('error');
      alertBox.classList.add('success');
    } else {
      alertBox.classList.remove('success');
      alertBox.classList.add('error');
    }

    alertBox.style.display = 'block';
    setTimeout(function () {
      alertBox.style.display = 'none';
    }, 2500);
  }

  quantidadeInput.addEventListener('input', calcularValorTotal);

  function calcularValorTotal() {
    const quantidade = parseInt(quantidadeInput.value);
    const total = precoUnitario * quantidade;
    valorTotalElement.textContent = `R$ ${total.toFixed(2)}`;
  }

  document.getElementById('finalizar-compra').addEventListener('click', async function () {

    if (!accessToken) {
      showCustomAlert('Por favor, faça login antes de prosseguir com a compra!', 'error');

      setTimeout(function () {
      window.location.href = 'http://127.0.0.1:3000/login.html'
      }, 2500);

      return;
    }

    const ingressoId = document.getElementById('ingresso-id').value;
    const quantidadeValue = parseInt(quantidadeInput.value);
    const valorTotal = parseFloat(valorTotalElement.textContent.split(' ')[1]);

    function generateBarcode() {
      return Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    const codigoPedido = generateBarcode();

    try {

      console.log('Authorization:', `Bearer ${accessToken}`);

      const response = await fetch(`http://127.0.0.1:3003/api/pedidos`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          IDUsuario: parseInt(IDUsuario),
          ingressoId: parseInt(ingressoId),
          quantidade: quantidadeValue,
          codigoPedido,
          valorTotal
        })
      });

      if (response.ok) {
        showCustomAlert('Compra realizada com sucesso! Verifique seus ingressos na sua área pessoal.', 'success');

        setTimeout(function () {
          window.location.href = 'http://127.0.0.1:3000/meusIngressos.html'
          }, 2500);

        modalCompra.hide();

      } else {
        showCustomAlert('Erro ao realizar a compra.', 'error');
      }
    } catch (error) {
      console.error('Erro ao realizar compra:', error);
    }
  });

});
