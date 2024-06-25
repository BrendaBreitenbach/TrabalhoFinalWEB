create database produtosFornecedores;

use produtosFornecedores;

create table fornecedor(
	id_fornecedor int auto_increment not null,
    nome varchar(100) not null,
    endereco varchar(200) not null,
    telefone varchar(15) not null,
    email varchar(150) not null,
    cnpj varchar(18) not null,
    constraint pk_fornecedor primary key (id_fornecedor)
);

create table produto(
	id_produto int auto_increment not null,
    nome varchar(50) not null,
    descricao varchar(250),
    preco float not null,
    quantidade int not null,
    id_fornecedor int not null,
	constraint pk_produto primary key(id_produto),
    constraint fk_produto_fornecedor foreign key(id_fornecedor) references fornecedor(id_fornecedor) 
);


select * from fornecedor;


INSERT INTO fornecedor (nome, endereco, telefone, email, cnpj) VALUES 
("FornecedorA", "Rua das Flores, 123, Bairro Jardim Primavera, São Paulo, SP", "(54)99914-7548", "fornecedorA@gmail.com", "12.345.678/0001-90");

select * from fornecedor WHERE nome LIKE '%B%';

UPDATE fornecedor 
SET nome = "FornecedorA", endereco = "Rua das Flores, 123, Bairro Jardim Primavera, Rio de Janeiro, RJ", telefone = "(54) 99914-7548", email = "fornecedorA@gmail.com", cnpj = "12.345.678/0001-90" 
WHERE id_fornecedor = 1;

select * from produto;

create view viewProduto as
select produto.id_produto, produto.nome, produto.descricao, produto.preco, produto.quantidade, fornecedor.nome as fornNome, produto.id_fornecedor 
from produto
inner join fornecedor 
on fornecedor.id_fornecedor = produto.id_fornecedor;

SELECT * FROM viewProduto where fornNome LIKE '%1%';

drop database produtosFornecedores;