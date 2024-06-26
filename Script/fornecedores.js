

//CARREGA A LISTA DE FORNECEDORES
document.addEventListener('DOMContentLoaded', (Event) => {
    buscaFornecedores();

    const endereco = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.links a');

    links.forEach(link => {
        const enderecoNavBar = link.getAttribute('href').split('/').pop();
        if (enderecoNavBar === endereco) {
            link.classList.add('selected');
        }
    });
});



//ABRE POPUP DE CADASTRO DO FORNECEDOR
document.getElementById('btnCadastroFornecedor').addEventListener("click", function() {
    document.getElementById('telaCadastrar').style.display = 'flex';
    document.getElementById('containerCadastrar').style.display = 'flex';
});


//FECHA POPUP DE CADASTRO DO FORNECEDOR
document.getElementById('btnCancelarPopup').addEventListener("click", function() {
    document.getElementById('telaCadastrar').style.display = 'none';
    document.getElementById('containerCadastrar').style.display = 'none';

    //Limpando campos
    document.getElementById('forn_nome').value = '';
    document.getElementById('forn_endereco').value = '';
    document.getElementById('forn_telefone').value = '';
    document.getElementById('forn_email').value = '';
    document.getElementById('forn_cnpj').value = '';
});


//FECHA O POPUP DE ALTERAR DO FORNECEDOR
document.getElementById('btnCancelarPopup_alt').addEventListener("click", function() {
    document.getElementById('telaAlterar').style.display = 'none';
    document.getElementById('containerAlterar').style.display = 'none';
});


//PESQUISA DO FORNECEDOR POR NOME
document.getElementById('pesquisaFornNome').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const nomeFornecedor = document.getElementById('pesquisaFornNome').value.trim();
        if(nomeFornecedor == ''){
            buscaFornecedores();
        } else {
            buscaFornecedorNome(nomeFornecedor);
        }
    } else {
        buscaFornecedores();
    }
});


//PESQUISA DO FORNECEDOR POR CNPJ
document.getElementById('pesquisaFornCNPJ').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const cnpj = document.getElementById('pesquisaFornCNPJ').value.trim();
        if(cnpj == ''){
            buscaFornecedores();
        } else {
            buscaFornecedorCNPJ(cnpj);
        }
    } else {
        buscaFornecedores();
    }
});


//FUNÇÃO QUE BUSCA TODOS OS FORNECEDORES CADASTRADOS
async function buscaFornecedores(){
    try{
        const response = await fetch(`http://localhost:3000/api/fornecedores`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const fornecedores = await response.json()
        listarFornecedores(fornecedores);
    } catch(error){
        console.log(error);
    }
};


//FUNÇÃO QUE BUSCA O FORNECEDOR POR ID
async function buscarFornecedorPorId(id){
    try{
        const response = await fetch(`http://localhost:3000/api/fornecedores/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const fornecedor = await response.json()
        console.log(fornecedor);
        return fornecedor;
    } catch(error){
        console.log(error);
    }
};


//FUNÇÃO DE BUSCA DO FORNECEDOR POR NOME
async function buscaFornecedorNome(nomeFornecedor){
    try{
        const response = await fetch(`http://localhost:3000/api/fornecedor/${nomeFornecedor}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const fornecedores = await response.json();
        console.log(fornecedores)
        listarFornecedores(fornecedores);
    } catch(error){
        console.log(error);
    }
};


//CADASTRAR UM FORNECEDOR
document.getElementById('form_fornecedor_cad').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('forn_nome').value;
    const endereco = document.getElementById('forn_endereco').value;
    const telefone = document.getElementById('forn_telefone').value;
    const email = document.getElementById('forn_email').value;
    const cnpj = document.getElementById('forn_cnpj').value;

    //VALIDAÇÕES (TELEFONE, EMAIL, CNPJ)
    if (!validarTelefone(telefone)) {
    } else if(!validarEmail(email)) {
        alert("Email inválido, por favor digite um email válido!");
    } else if(!validaCNPJ(cnpj)) {
        alert("CNPJ inválido, por favor digite um CNPJ válido!");
    } else { 
        try{
            const response = await fetch('http://localhost:3000/api/fornecedores', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, endereco, telefone, email, cnpj})
            });

            const message = await response.text();

            if (response.ok) {
                //alert("Fornecedor cadastrado com sucesso!");

                //FECHA O POPUP APOS CADASTRAR UM FORNECEDOR
                document.getElementById('telaCadastrar').style.display = 'none';
                document.getElementById('containerCadastrar').style.display = 'none';

                window.location.reload();
                //Limpando campos
                document.getElementById('forn_nome').value = '';
                document.getElementById('forn_endereco').value = '';
                document.getElementById('forn_telefone').value = '';
                document.getElementById('forn_email').value = '';
                document.getElementById('forn_cnpj').value = '';

            } else {
                alert(message);
            }
        } catch(error){
            console.error('Erro ao cadastrar fornecedor:', error);
            alert('Erro no servidor');
        }
    }

});

//FUNÇÃO QUE VALIDA O TELEFONE
function validarTelefone(telefone) {
    
    const telefoneNum = telefone.replace(/\D/g, '');

    if (telefoneNum.length === 11) {
        const regex = /^\d{2}9\d{4}\d{4}$/;
        return regex.test(telefoneNum);
    } else {
        alert("Telefone inválido, por favor digite um telefone no formato: (XX) 9XXXX-YYYY");
        return false;
    }
}

//FUNÇÃO QUE VALIDA O EMAIL
function validarEmail(email) {
    return validator.isEmail(email);
}

//FUNÇÃO QUE VALIDA O CNPJ
function validaCNPJ (cnpj) {
    var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
    var c = String(cnpj).replace(/[^\d]/g, '')
    
    if(c.length !== 14)
        return false

    if(/0{14}/.test(c))
        return false

    for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
    if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
    if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    return true
}


//ALTERAR UM FORNECEDOR
document.getElementById('form_fornecedor_alt').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('forn_id_alt').value;
    const nome = document.getElementById('forn_nome_alt').value;
    const endereco = document.getElementById('forn_endereco_alt').value;
    const telefone = document.getElementById('forn_telefone_alt').value;
    const email = document.getElementById('forn_email_alt').value;
    const cnpj = document.getElementById('forn_cnpj_alt').value;

    //VALIDAÇÕES (TELEFONE, EMAIL, CNPJ)
    if (!validarTelefone(telefone)) {
    } else if(!validarEmail(email)) {
        alert("Email inválido, por favor digite um email válido!");
    } else if(!validaCNPJ(cnpj)) {
        alert("CNPJ inválido, por favor digite um CNPJ válido!");
    } else {
        try{
            const response = await fetch(`http://localhost:3000/api/fornecedores/${id}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, endereco, telefone, email, cnpj})
            });

            const message = await response.text();

            if (response.ok) {
                //FECHA O POPUP  DEPOIS DE ALTERAR O FORNECEDOR
                document.getElementById('telaAlterar').style.display = 'none';
                document.getElementById('containerAlterar').style.display = 'none';

                window.location.reload();

            } else {
                alert(message);
            }
        } catch(error){
            console.error('Erro ao cadastrar fornecedor:', error);
            alert('Erro no servidor');
        }
    }
});


//BUSCA O FORNECEDOR POR CNPJ
async function buscaFornecedorCNPJ(cnpj){
    try{
        const response = await fetch(`http://localhost:3000/api/fornecedor/cnpj/${cnpj}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const fornecedores = await response.json();
        console.log(fornecedores)
        listarFornecedores(fornecedores);
    } catch(error){
        console.log(error);
    }
};


//FUNÇÃO DE DELETAR UM FORNECEDOR
async function deletarFornecedor(id){
    try{
        const response = await fetch(`http://localhost:3000/api/fornecedores/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.ok){
            //alert("Fornecedor deletado com sucesso!");
        }
    } catch(error){
        console.log(error);
    }
};


//FUNÇÃO QUE MONTA A TABELA DOS FORNECEDORES
async function listarFornecedores(fornecedores) {
    const tabelaDiv = document.getElementById('tabela_fornecedores');
    let tabelaHTML = `
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Endereço</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">Email</th>
                    <th scope="col">CNPJ</th>
                    <th scope="col">Operações</th>
                </tr>
            </thead>
            <tbody>
    `;
    for (let i = 0; i < fornecedores.length; i++) {
        //const idAlterar = `alterar-${fornecedores[i].id_fornecedor}`;
        //const idDeletar = `deletar-${fornecedores[i].id_fornecedor}`;
        tabelaHTML += `
                        <tr id="linha-${fornecedores[i].id_fornecedor}">
                            <th scope="row">${fornecedores[i].id_fornecedor}</th>
                            <td class="text">${fornecedores[i].nome}</td>
                            <td class="text">${fornecedores[i].endereco}</td>
                            <td class="text">${fornecedores[i].telefone}</td>
                            <td class="text">${fornecedores[i].email}</td>
                            <td class="text">${fornecedores[i].cnpj}</td>
                            <td class="text">
                                <div>
                                    <button data-id="${fornecedores[i].id_fornecedor}" class="btn-operacoes btn-alterar">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button data-id="${fornecedores[i].id_fornecedor}" class="btn-operacoes btn-deletar">
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
                const fornecedor = await buscarFornecedorPorId(id);
                document.getElementById('telaAlterar').style.display = 'flex';
                document.getElementById('containerAlterar').style.display = 'flex';
                console.log(fornecedor);
                if (fornecedor) {
                    document.getElementById('forn_nome_alt').value = fornecedor.nome;
                    document.getElementById('forn_endereco_alt').value = fornecedor.endereco;
                    document.getElementById('forn_telefone_alt').value = fornecedor.telefone;
                    document.getElementById('forn_email_alt').value = fornecedor.email;
                    document.getElementById('forn_cnpj_alt').value = fornecedor.cnpj;
                
                    document.getElementById('forn_id_alt').value = fornecedor.id_fornecedor;

                } else {
                    console.error("Fornecedor não encontrado");
                }
            } catch (error) {
                console.error("Erro ao buscar fornecedor: ", error);
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
                await deletarFornecedor(id);
                window.location.reload();
            } catch(error){
                console.log(error);
            }
        });
    });

};

