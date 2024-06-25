// db.test.js
const mysql = require("mysql2/promise");
const {
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
  deletarProduto,
} = require('../db');

jest.mock('mysql2/promise', () => {
  const mockPool = {
    query: jest.fn(),
  };
  return {
    createPool: jest.fn(() => mockPool),
  };
});

describe('Operações CRUD em Fornecedores', () => {
  let mockPool;

  beforeEach(() => {
    mockPool = mysql.createPool();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('selectFornecedores deve retornar todos os Fornecedores', async () => {
    const mockResults = [{ id_fornecedor: 1, nome: 'Fornecedor 1' }];
    mockPool.query.mockResolvedValue([mockResults]);

    const result = await selectFornecedores();

    expect(mockPool.query).toHaveBeenCalledWith("SELECT * FROM fornecedor;");
    expect(result).toEqual(mockResults);
  });

  test('selectFornecedorID deve retornar um fornecedor por ID', async () => {
    const mockResults = [{ id_fornecedor: 1, nome: 'Fornecedor 1' }];
    mockPool.query.mockResolvedValue([mockResults]);

    const result = await selectFornecedorID(1);

    expect(mockPool.query).toHaveBeenCalledWith("SELECT * FROM fornecedor WHERE id_fornecedor = ?;", [1]);
    expect(result).toEqual(mockResults);
  });

  test('selectFornecedorNome deve retornar um fornecedor por nome', async () => {
    const mockResults = [{ id_fornecedor: 1, nome: 'Fornecedor 1' }];
    mockPool.query.mockResolvedValue([mockResults]);

    const result = await selectFornecedorNome('Fornecedor');

    expect(mockPool.query).toHaveBeenCalledWith("SELECT * FROM fornecedor WHERE nome LIKE ?", [`%Fornecedor%`]);
    expect(result).toEqual(mockResults);
  });

  test('inserirFornecedor deve inserir um novo fornecedor', async () => {
    const newFornecedor = {
      nome: 'Fornecedor 1',
      endereco: 'Endereco 1',
      telefone: '123456789',
      email: 'fornecedor1@example.com',
      cnpj: '12345678000100'
    };

    await inserirFornecedor(newFornecedor);

    expect(mockPool.query).toHaveBeenCalledWith(
      "INSERT INTO fornecedor (nome, endereco, telefone, email, cnpj) VALUES (?, ?, ?, ?, ?)",
      [newFornecedor.nome, newFornecedor.endereco, newFornecedor.telefone, newFornecedor.email, newFornecedor.cnpj]
    );
  });
});

describe('Operações CRUD em Produtos', () => {
  let mockPool;

  beforeEach(() => {
    mockPool = mysql.createPool();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('selectProdutos deve retornar todos os produtos', async () => {
    const mockResults = [{ id_produto: 1, nome: 'Produto 1' }];
    mockPool.query.mockResolvedValue([mockResults]);

    const result = await selectProdutos();

    expect(mockPool.query).toHaveBeenCalledWith("SELECT * FROM viewProduto;");
    expect(result).toEqual(mockResults);
  });

  test('selectProdutoID deve retornar o produto por ID', async () => {
    const mockResults = [{ id_produto: 1, nome: 'Produto 1' }];
    mockPool.query.mockResolvedValue([mockResults]);

    const result = await selectProdutoID(1);

    expect(mockPool.query).toHaveBeenCalledWith("SELECT * FROM produto WHERE id_produto = ?;", [1]);
    expect(result).toEqual(mockResults);
  });

  test('inserirProdutos deve inserir um novo produto', async () => {
    const newProduto = {
      nome: 'Produto 1',
      descricao: 'Descricao 1',
      preco: 100,
      quantidade: 10,
      fornecedor: 1
    };

    await inserirProdutos(newProduto);

    expect(mockPool.query).toHaveBeenCalledWith(
      "INSERT INTO produto (nome, descricao, preco, quantidade, id_fornecedor) VALUES (?, ?, ?, ?, ?)",
      [newProduto.nome, newProduto.descricao, newProduto.preco, newProduto.quantidade, newProduto.fornecedor]
    );
  });
});
