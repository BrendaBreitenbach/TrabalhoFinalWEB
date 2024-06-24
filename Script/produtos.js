
document.addEventListener('DOMContentLoaded', (Event) => {
    buscaProdutos();
});

//ABRE POPUP DE CADASTRO DO PRODUTO
document.getElementById('btnCadastroProdutos').addEventListener("click", function() {
    document.getElementById('telaCadastrar').style.display = 'flex';
    document.getElementById('containerCadastrar').style.display = 'flex';
});


//FECHA POPUP DE CADASTRO DO PRODUTO
document.getElementById('btnCancelarPopup').addEventListener("click", function() {
    document.getElementById('telaCadastrar').style.display = 'none';
    document.getElementById('containerCadastrar').style.display = 'none';
});

//FECHA O POPUP DE ALTERAR DO PRODUTO
document.getElementById('btnCancelarPopup_alt').addEventListener("click", function() {
    document.getElementById('telaAlterar').style.display = 'none';
    document.getElementById('containerAlterar').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    preencherSelectFornecedores();
});

//FUNÇÃO QUE BUSCA TODOS OS FORNECEDORES PARA AS OPÇÕES DO SELECT
async function buscaFornecedores(){
    try{
        const response = await fetch(`http://localhost:3000/api/fornecedores`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const fornecedores = await response.json()
        return fornecedores;
    } catch(error){
        console.log(error);
    }
};

//FUNÇÃO QUE BUSCA TODOS OS PRODUTOS CADASTRADOS
async function buscaProdutos(){
    try{
        const response = await fetch(`http://localhost:3000/api/produtos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const produtos = await response.json()
        listarProdutos(produtos);
    } catch(error){
        console.log(error);
    }
};

//FUNÇÃO QUE BUSCA O PRODUTO POR ID
async function buscarProdutoPorId(id){
    try{
        const response = await fetch(`http://localhost:3000/api/produtos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const produto = await response.json()
        console.log(produto);
        return produto;
    } catch(error){
        console.log(error);
    }
};


async function preencherSelectFornecedores() {
    const selectFornecedor = document.getElementById('selectFornecedor');
    const fornecedores = await buscaFornecedores();

    // Limpar opções existentes (caso necessário)
    //selectFornecedor.innerHTML = '';

    fornecedores.forEach(fornecedor => {
        const option = document.createElement('option');
        option.value = fornecedor.id_fornecedor;
        option.textContent = fornecedor.nome;
        selectFornecedor.appendChild(option);
    });
};

document.getElementById('form_produto_cad').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('prod_nome').value;
    const descricao = document.getElementById('prod_desc').value;
    const preco = document.getElementById('prod_preco').value;
    const quantidade = document.getElementById('prod_quant').value;
    const fornecedor = document.getElementById('selectFornecedor').value;

    console.log("Produto: ", nome, ", ", descricao, ", ", preco, ", ", quantidade, ", ", fornecedor);

    try{
        const response = await fetch('http://localhost:3000/api/produtos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, descricao, preco, quantidade, fornecedor})
        });

        const message = await response.text();

        if (response.ok) {
            alert("Produto cadastrado com sucesso!");

            //FECHA O POPUP APOS CADASTRAR UM PRODUTO
            document.getElementById('telaCadastrar').style.display = 'none';
            document.getElementById('containerCadastrar').style.display = 'none';

            window.location.reload();

        } else {
            alert(message);
        }
    } catch(error){
        console.error('Erro ao cadastrar produto:', error);
        alert('Erro no servidor');
    }
});


//FUNÇÃO QUE MONTA A TABELA DOS PRODUTOS
async function listarProdutos(produtos) {
    const tabelaDiv = document.getElementById('tabela_produtos');
    let tabelaHTML = `
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Descrição</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Quantidade</th>
                    <th scope="col">Fornecedor</th>
                    <th scope="col">Operações</th>
                </tr>
            </thead>
            <tbody>
    `;
    for (let i = 0; i < produtos.length; i++) {
        //const idAlterar = `alterar-${produtos[i].id_produto}`;
        //const idDeletar = `deletar-${produtos[i].id_produto}`;
        tabelaHTML += `
                        <tr id="linha-${produtos[i].id_produto}">
                            <th scope="row">${produtos[i].id_produto}</th>
                            <td>${produtos[i].nome}</td>
                            <td class="text">${produtos[i].descricao}</td>
                            <td>${produtos[i].preco}</td>
                            <td>${produtos[i].quantidade}</td>
                            <td>${produtos[i].fornecedor}</td>
                            <td>
                                <div>
                                    <button data-id="${produtos[i].id_produto}" class="btn-operacoes btn-alterar">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button data-id="${produtos[i].id_produto}" class="btn-operacoes btn-deletar">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
    }
    tabelaHTML += `
                </tbody>
            </table>
    `;
    tabelaDiv.innerHTML = tabelaHTML;

    //AÇÃO DO BOTÃO DE ALTERAR
    document.querySelectorAll('.btn-alterar').forEach(btn => {
        btn.addEventListener('click', async (event) => {
            event.stopPropagation();
            const id = btn.getAttribute('data-id');
            console.log("id: ", id);

            try {
                const produto = await buscarProdutoPorId(id);
                document.getElementById('telaAlterar').style.display = 'flex';
                document.getElementById('containerAlterar').style.display = 'flex';
                console.log(produto);
                if (produto) {
                    document.getElementById('prod_nome_alt').value = produto.nome;
                    document.getElementById('prod_desc_alt').value = produto.descricao;
                    document.getElementById('prod_preco_alt').value = produto.preco;
                    document.getElementById('prod_quant_alt').value = produto.quantidade;
                
                    document.getElementById('prod_id_alt').value = produto.id_produto;

                } else {
                    console.error("Produto não encontrado");
                }
            } catch (error) {
                console.error("Erro ao buscar produto: ", error);
            }
        });
    });

    //AÇÃO DO BOTÃO DE DELETAR
    document.querySelectorAll('.btn-deletar').forEach(btn => {
        btn.addEventListener('click', async (event) => {
            event.stopPropagation();
            const id = btn.getAttribute('data-id');
            console.log("id: ", id);

            try {
                await deletarProduto(id);
                window.location.reload();
            } catch(error){
                console.log(error);
            }
        });
    });

};


//FUNÇÃO DE DELETAR UM PRODUTI
async function deletarProduto(id){
    try{
        const response = await fetch(`http://localhost:3000/api/produtos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.ok){
            alert("Produto deletado com sucesso!");
        }
    } catch(error){
        console.log(error);
    }
};