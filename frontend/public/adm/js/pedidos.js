document.addEventListener('DOMContentLoaded', function () {
    getPedidosData();
});

function getPedidosData() {
    fetch('http://127.0.0.1:3003/api/pedidos')
        .then(response => response.json())
        .then(pedidoData => {
            fillTableWithPedidosData(pedidoData);
        })
        .catch(error => {
            console.error('Erro ao recuperar dados dos pedidos:', error);
        });
}

function fillTableWithPedidosData(pedidoData) {
    var tableBody = document.querySelector('#datatablesSimples tbody');

    var tableHeader = '<thead>' +
        '<tr>' +
        '<th>ID</th>' +
        '<th>Nome do cliente</th>' +
        '<th>Data da compra</th>' +
        '<th>Tipo do ingresso</th>' +
        '<th>Quantidade</th>' +
        '<th>Valor total</th>' +
        '<th>Código da compra</th>' +
        '</tr>' +
        '</thead>';

    tableBody.insertAdjacentHTML('beforebegin', tableHeader);

    pedidoData.forEach(function (pedido) {

        var row = '<tr>' +
            '<td>' + pedido.id + '</td>' +
            '<td>' + pedido.cliente.nome + '</td>' +
            '<td>' + (new Date(pedido.dataPedido).getDate()) + '/' + (new Date(pedido.dataPedido).getMonth() + 1) + '/' + (new Date(pedido.dataPedido).getFullYear()) + '</td>' +
            '<td>' + pedido.ingresso.tipo + '</td>' +
            '<td>' + pedido.quantidade + '</td>' +
            '<td>' + pedido.valorTotal.toFixed(2) + '</td>' +
            '<td>' + pedido.codigoPedido + '</td>' +
            '</tr>';


        tableBody.innerHTML += row;
    });
}
