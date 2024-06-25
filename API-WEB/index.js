require("dotenv").config();

const db = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


//PRODUTOS

//Busca todos os produtos
app.get("/api/produtos", async (request, response) => {
    const resultado = await db.selectProdutos();
    response.json(resultado);
});

//Busca produtos por nome
app.get("/api/produto/:nomeProduto", async (request, response) => {
    const nomeProduto = request.params.nomeProduto;
    const resultado = await db.selectProdutosNome(nomeProduto);
    response.json(resultado);
});

//Busca produtos por fornecedor
app.get("/api/produto/forn/:nomeForn", async (request, response) => {
    const nomeForn = request.params.nomeForn;
    const resultado = await db.selectProdutosForn(nomeForn);
    response.json(resultado);
});

//Busca produto por ID
app.get("/api/produtos/:id", async (request, response) => {
    const id_produto = parseInt(request.params.id);
    try{
        const produto = await db.selectProdutoID(id_produto);
        response.json(produto[0]);
    } catch(error) {
        console.log("erro: ", error);
    }
});

//Insere um produto
app.post("/api/produtos", async (request, response) => {
    const produto = request.body;
    console.log(produto);
    try{
        await db.inserirProdutos(produto);
        response.sendStatus(201);
    } catch (error) {
        console.log("Erro ao cadastrar um produto: ", error);
    }
});

//Altera um produto
app.put("/api/produtos/:id", async (request, response) => {
    const id_produto = parseInt(request.params.id);
    const produto = request.body;
    try{
        await db.alterarProduto(id_produto, produto);
        response.sendStatus(200);
    } catch(error){
        console.log("Erro ao alterar o produto: ", error);
    }
});

//Deletar um produto
app.delete("/api/produtos/:id", async (request, response) => {
    const id_produto = parseInt(request.params.id);
    await db.deletarProduto(id_produto);
    response.sendStatus(200);
});

//Fornecedores

//Busca todos os fornecedores
app.get("/api/fornecedores", async (request, response) => {
    const resultado = await db.selectFornecedores();
    response.json(resultado);
});

//Busca fornecedor por ID
app.get("/api/fornecedores/:id", async (request, response) => {
    const id_fornecedor = parseInt(request.params.id);
    try{
        const fornecedor = await db.selectFornecedorID(id_fornecedor);
        response.json(fornecedor[0]);
    } catch(error) {
        console.log("erro: ", error);
    }
});

//Busca fornecedor por nome
app.get("/api/fornecedor/:nome", async (request, response) => {
    const nomeFornecedor = request.params.nome;
    try{
        const result = await db.selectFornecedorNome(nomeFornecedor);
        response.json(result);
    }catch(error){
        console.log("Erro: ", error);
    }
});

//Busca fornecedor por CNPJ
app.get("/api/fornecedor/cnpj/:cnpj", async (request, response) => {
    const cnpj = request.params.cnpj;
    try{
        const result = await db.selectFornecedorCNPJ(cnpj);
        response.json(result);
    }catch(error){
        console.log("Erro: ", error);
    }
});

//Insere um fornecedor
app.post("/api/fornecedores", async (request, response) => {
    const fornecedor = request.body;
    try{
        await db.inserirFornecedor(fornecedor);
        response.sendStatus(201);
    } catch (error) {
        console.log("Erro ao cadastrar um fornecedor: ", error);
    }
});

//Altera um fornecedor
app.put("/api/fornecedores/:id", async (request, response) => {
    const id_fornecedor = parseInt(request.params.id);
    const fornecedor = request.body;
    try{
        await db.alterarFornecedor(id_fornecedor, fornecedor);
        response.sendStatus(200);
    } catch(error){
        console.log("Erro ao alterar o fornecedor: ", error);
    }
});

//Deletar um fornecedor
app.delete("/api/fornecedores/:id", async (request, response) => {
    const id_fornecedor = parseInt(request.params.id);
    await db.deletarFornecedor(id_fornecedor);
    response.sendStatus(200);
});

app.get("/", (request, response) => {
    response.json({
        message: "Ola"
    });
})

app.listen(process.env.PORT, () => {
    console.log("App is running!");
});
 
module.exports = app;