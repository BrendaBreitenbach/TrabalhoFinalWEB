const mysql = require("mysql2/promise");

const fornecedores = mysql.createPool(process.env.CONNECTION_STRING);
const produtos = mysql.createPool(process.env.CONNECTION_STRING);


//CRUD Fornecedores

//Busca todos os fornecedores
async function selectFornecedores(){
    const results = await fornecedores.query("SELECT * FROM fornecedor;");
    return results[0];
}

//Busca fornecedor por id
async function selectFornecedorID(id){
    const results = await fornecedores.query("SELECT * FROM fornecedor WHERE id_fornecedor = ?;", [id]);
    return results[0];
}

//Busca fornecedor por nome
async function selectFornecedorNome(nome){
    const results = await fornecedores.query("SELECT * FROM fornecedor WHERE nome LIKE ?", [`%${nome}%`]);
    return results[0];
}

//Busca fornecedor por cnpj
async function selectFornecedorCNPJ(cnpj){
    const results = await fornecedores.query("SELECT * FROM fornecedor WHERE cnpj LIKE ?", [`%${cnpj}%`]);
    return results[0];
}

//Insere um fornecedor
async function inserirFornecedor(fornecedor){
    const novoFornecedor = [fornecedor.nome, fornecedor.endereco, fornecedor.telefone, fornecedor.email, fornecedor.cnpj];
    await fornecedores.query("INSERT INTO fornecedor (nome, endereco, telefone, email, cnpj) VALUES (?, ?, ?, ?, ?)", novoFornecedor);
}

//Altera fornecedor
async function alterarFornecedor(id, fornecedor){
    const alteraFornecedor = [fornecedor.nome, fornecedor.endereco, fornecedor.telefone, fornecedor.email, fornecedor.cnpj, id];
    await fornecedores.query("UPDATE fornecedor SET nome = ?, endereco = ?, telefone = ?, email = ?, cnpj = ? WHERE id_fornecedor = ?;", alteraFornecedor);
}

//Deleta um fornecedor
async function deletarFornecedor(id) {
    await fornecedores.query("DELETE FROM fornecedor WHERE id_fornecedor=?", [id]);
}

//CRUD Produtos

//Busca todos os produtos
async function selectProdutos(){
    const results = await produtos.query("SELECT * FROM viewProduto;");
    return results[0];
}

//Busca produtos por nome
async function selectProdutosNome(nomeProduto){
    const results = await produtos.query("SELECT * FROM viewProduto where nome LIKE ?;",[`%${nomeProduto}%`]);
    return results[0];
}

//Busca produtos por fornecedor
async function selectProdutosForn(nomeForn){
    const results = await produtos.query("SELECT * FROM viewProduto where fornNome LIKE ?;",[`%${nomeForn}%`]);
    console.log(nomeForn);
    console.log(results[0]);
    return results[0];
}

//Busca produto por id
async function selectProdutoID(id){
    const results = await produtos.query("SELECT * FROM produto WHERE id_produto = ?;", [id]);
    return results[0];
}

//Insere um produto
async function inserirProdutos(produto){
    console.log("db: ", produto);
    const novoProduto = [produto.nome, produto.descricao, produto.preco, produto.quantidade, produto.fornecedor];
    await produtos.query("INSERT INTO produto (nome, descricao, preco, quantidade, id_fornecedor) VALUES (?, ?, ?, ?, ?)", novoProduto);
}

//Altera produto
async function alterarProduto(id, produto){
    const alteraProduto = [produto.nome, produto.descricao, produto.preco, produto.quantidade, produto.id_fornecedor, id];
    await produtos.query("UPDATE produto SET nome = ?, descricao = ?, preco = ?, quantidade = ?, id_fornecedor = ? WHERE id_produto = ?;", alteraProduto);
}

//Deleta um produto
async function deletarProduto(id) {
    await produtos.query("DELETE FROM produto WHERE id_produto=?", [id]);
}


module.exports = {
    selectFornecedores,
    selectFornecedorID,
    selectFornecedorNome,
    selectFornecedorCNPJ,
    inserirFornecedor,
    alterarFornecedor,
    deletarFornecedor,
    selectProdutos,
    selectProdutosNome,
    selectProdutosForn,
    selectProdutoID,
    inserirProdutos,
    alterarProduto,
    deletarProduto
}