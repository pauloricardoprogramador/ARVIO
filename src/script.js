let btnTodos = document.getElementById('todos');
let btnEntradas = document.getElementById('entradas');
let btnSaidas = document.getElementById('saidas');

let operacoes = JSON.parse(localStorage.getItem('operacoes')) || [];


function validarTransacao() {
    let nomeInput = document.getElementById('nome');
    let tipoInput = document.getElementById('tipo');
    let valorInput = document.getElementById('valor-adicionado');

    let nomeDigitado = nomeInput.value.trim();
    let tipoEscolhido = tipoInput.value;
    let valorDigitado = parseFloat(valorInput.value);

    if (nomeDigitado === '') {
        Toastify({
            text: "Digite um nome",
            duration: 2000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true,
            style: {
              background: "#963c3ce8",
            },
            onClick: function(){} 
          }).showToast();
        return false;
    }

    if (tipoEscolhido === '') {
        Toastify({
            text: "Escolha um tipo, por favor!",
            duration: 2000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true,
            style: {
              background: "#963c3ce8",
            },
            onClick: function(){} 
          }).showToast();
        return false;
    }

    if (isNaN(valorDigitado) || valorDigitado <= 0) {
        Toastify({
            text: "Adicione um valor válido",
            duration: 2000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true,
            style: {
              background: "#963c3ce8",
            },
            onClick: function(){} 
          }).showToast();
        return false;
    }
    else{
        Toastify({
            text: "Transação concluida",
            duration: 2000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true,
            style: {
              background: "#35a327d7",
            },
            onClick: function(){} 
          }).showToast();
          return true;
    }
}

function addTransacao(nome, tipo, valor, index = null) {
    let transacao = {
        nome: nome,
        tipo: tipo,
        valor: parseFloat(valor),
    };
    if (index !== null) {
        operacoes[index] = transacao;
    } else {
        operacoes.push(transacao);
    }
    localStorage.setItem('operacoes', JSON.stringify(operacoes)); 
    atualizarLista();
    mostrarSaldo();
}


function atualizarLista() {
    mostrarTransacoesFiltradas(operacoes);
}


function resetarFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('valor-adicionado').value = '';

    let btnAdicionar = document.getElementById('adicionar');
    btnAdicionar.textContent = 'Adicionar Transação';
    btnAdicionar.onclick = handleAdicionarTransacao;
}


function editarTransacao(index) {
    let transacao = operacoes[index];

    document.getElementById('nome').value = transacao.nome;
    document.getElementById('tipo').value = transacao.tipo;
    document.getElementById('valor-adicionado').value = transacao.valor;

    let btnAdicionar = document.getElementById('adicionar');
    btnAdicionar.textContent = 'Confirmar Alterações';

    btnAdicionar.onclick = function () {
        if (validarTransacao()) {
            addTransacao(
                document.getElementById('nome').value,
                document.getElementById('tipo').value,
                document.getElementById('valor-adicionado').value,
                index
            );

            resetarFormulario();
        }
    };
}

function handleAdicionarTransacao() {
    if (validarTransacao()) {
        addTransacao(
            document.getElementById('nome').value,
            document.getElementById('tipo').value,
            document.getElementById('valor-adicionado').value
        );

        resetarFormulario();
    }
}


function deletarTransacao(index) {
    operacoes.splice(index, 1); 
    localStorage.setItem('operacoes', JSON.stringify(operacoes));
    atualizarLista();
    mostrarSaldo();
}

function mostrarSaldo() {
    let saldo = document.getElementById('status');
    let totalEntrada = 0;
    let totalSaida = 0;

    for (let operacao of operacoes) {
        if (operacao.tipo === 'entrada') {
            totalEntrada += operacao.valor;
        } else if (operacao.tipo === 'saida') {
            totalSaida += operacao.valor;
        }
    }

    let saldoTotal = totalEntrada - totalSaida;
    saldo.innerHTML = `R$ ${saldoTotal.toFixed(2)}`;
}


function mostrarTransacoesFiltradas(transacoes) {
    let ul = document.getElementById('lista');
    ul.innerHTML = ''; 
    transacoes.forEach((transacao, index) => {
        let lista = document.createElement('li');

        if (transacao.tipo === 'saida') {
            lista.classList.add('saida');
        }

        lista.innerHTML = `
            <div class="lista-itens">
                <div class='lista-itens-primary'>
                    <p>${transacao.nome}</p>
                    <span id="valor-lista">R$ ${transacao.valor.toFixed(2)}</span>
                </div>
                <div class="btns">
                    <div class='btn-categoria'> 
                        <span id="categoria">${transacao.tipo}</span>
                    </div>
                    <div class="lista-itens2">
                        <button class="editar-transacao" onclick="editarTransacao(${index})">
                            <i class="fa-regular fa-pen-to-square" id='b1'></i>
                        </button>
                        <button class="deletar-transacao" onclick="deletarTransacao(${index})">
                            <i class="fa-solid fa-trash" id='b2'></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        ul.appendChild(lista);
    });
}

btnTodos.addEventListener('click', function () {
    mostrarTransacoesFiltradas(operacoes);
});

btnEntradas.addEventListener('click', function () {
    let transacoesEntrada = operacoes.filter((transacao) => transacao.tipo === 'entrada');
    mostrarTransacoesFiltradas(transacoesEntrada);
});

btnSaidas.addEventListener('click', function () {
    let transacoesSaida = operacoes.filter((transacao) => transacao.tipo === 'saida');
    mostrarTransacoesFiltradas(transacoesSaida);
});

document.getElementById('adicionar').onclick = handleAdicionarTransacao;

atualizarLista();
mostrarSaldo();
