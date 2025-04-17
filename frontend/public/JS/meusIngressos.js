document.addEventListener('DOMContentLoaded', async function () {
    const IDUsuario = localStorage.getItem('IDUsuario');
    const accessToken = localStorage.getItem('accessToken');
    const erroIngresso = document.getElementById('erroIngressos');
    const semIngressos = document.getElementById('semIngressos');

    if (!accessToken) {
        erroIngresso.style.display = 'block';
    }

    async function buscarPedidos() {
        try {
            const response = await fetch(`http://127.0.0.1:3003/api/pedidos/${IDUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
                
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar pedidos');
            }
          
            const pedidos = await response.json();
            const listaPedidos = document.getElementById('pedidos-lista');

            listaPedidos.innerHTML = '';

            if (pedidos.length === 0) {
                semIngressos.style.display = 'block'; 
            } else {
                semIngressos.style.display = 'none'; 
            }

            pedidos.forEach(pedido => {

                const valorDoIngresso = `R$ ${pedido.ingresso.preco.toFixed(2)}`;
                const valorTotalDoIngresso = `R$ ${pedido.valorTotal.toFixed(2)}`;

                const dataPedido = new Date(pedido.dataPedido);
                const dataFormatada = `${dataPedido.getDate()}/${dataPedido.getMonth() + 1}/${dataPedido.getFullYear()}`;

                const listItem = document.createElement('div');
                listItem.classList.add('col-lg-4', 'col-md-6', 'mb-4');

                const cardContent = `
                    <div class="card mt-2">
                        <div class="card-body">
                            <p class="card-title"><strong>Tipo:</strong> ${pedido.ingresso.tipo}</p>
                            <p class="card-text"><strong>Data da compra:</strong> ${dataFormatada}</p>
                            <p class="card-text"><strong>Valor total:</strong> ${valorTotalDoIngresso}</p>
                            <button class="btn btn-outline-custom btn-checkin" data-pedido-id="${pedido.id}">Fazer Check-In</button>
                        </div>
                    </div>
                `;

                listItem.innerHTML = cardContent;
                listaPedidos.appendChild(listItem);
            });

            document.querySelectorAll('.btn-checkin').forEach(button => {
                button.addEventListener('click', function () {
                    const pedidoId = this.getAttribute('data-pedido-id');
                    const pedido = pedidos.find(p => p.id == pedidoId);
                    abrirModalCheckin(pedido);
                });
            });
        } catch (error) {
            console.error('Erro:', error);
        }
    }

   
    function abrirModalCheckin(pedido) {

        document.getElementById('modalTipo').innerText = pedido.ingresso.tipo;
        document.getElementById('modalDataCompra').innerText = `${new Date(pedido.dataPedido).getDate()}/${new Date(pedido.dataPedido).getMonth() + 1}/${new Date(pedido.dataPedido).getFullYear()}`;
        document.getElementById('modalQuantidade').innerText = pedido.quantidade; 
        document.getElementById('modalPreco').innerText = pedido.ingresso.preco.toFixed(2);
        document.getElementById('modalValorTotal').innerText = (pedido.ingresso.preco * pedido.quantidade).toFixed(2); 

        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, pedido.codigoPedido, {
            format: "CODE128",
            displayValue: false
        });
    
        const barcodeImage = barcodeCanvas.toDataURL();
    
        JsBarcode("#barcode", pedido.codigoPedido);

        const modal = new bootstrap.Modal(document.getElementById('checkinModal'));
        modal.show();
    }

    window.onload = buscarPedidos;
});
