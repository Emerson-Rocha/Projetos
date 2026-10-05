//https://expressjs.com/
//https://nodemon.io/
//https://expressjs.com/en/resources/middleware/cors/
//https://www.npmjs.com/package/mssql

//npm install mssql msnodesqlv8


const express = require('express');
const cors = require('cors');
let app = express();
app.use(express.json());// antigamenete era o body-parser precisa ser instalado, mas agora já vem junto com o express
let port = 3010;

const { sql, conectar } = require('./database.js');

app.use(cors());

// SELECT 
app.get('/', async (req, res) => {
    // fazer diretamente a conexão com o banco de dados
    const cn = await conectar();
    // fazer o query para testar a conexão com o banco de dados
    const result = await cn.request().query("SELECT * FROM USUARIO");
    //res.send('Conexão com o banco de dados realizada com sucesso!');    
    res.json(result.recordset);

    //res.send('Hsadasl');
});

// INSERT
app.post("/INSERT", async (req, res) => {
    const {
        nome,
        email,
        telefone,
        senha,
        cpf_cnpj,
        tipo_pessoa,
        data_nasc
    } = req.body; // está pegando os dados do corpo da requisição
    ;
    const cn = await conectar(); // conectando com o banco de dados
    // Executar INSERT
    const result = await cn
        .request()
        .input('nome', sql.VarChar(100), nome)
        .input('email', sql.VarChar(100), email)
        .input('telefone', sql.VarChar(20), telefone)
        .input('senha', sql.VarChar(255), senha)
        .input('cpf_cnpj', sql.VarChar(18), cpf_cnpj)
        .input('tipo_pessoa', sql.Char(1), tipo_pessoa)
        .input('data_nasc', sql.Date, data_nasc)

        .query(`
                INSERT INTO USUARIO
                (
                    nome,
                    email,
                    telefone,
                    senha,
                    cpf_cnpj,
                    tipo_pessoa,
                    data_nasc
                )
                OUTPUT INSERTED.*
                VALUES
                (
                    @nome,
                    @email,
                    @telefone,
                    @senha,
                    @cpf_cnpj,
                    @tipo_pessoa,
                    @data_nasc
                )
            `);


    res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: result.recordset[0]
    });
});

// DELETE
app.delete('/usuarios/:id', async (req, res) => {

    try {

        // Pegar o ID da URL
        const id = parseInt(req.params.id);

        // Conectar ao SQL Server
        const cn = await conectar();

        // Executar DELETE
        const result = await cn
            .request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM USUARIO
                OUTPUT DELETED.*
                WHERE id_usuario = @id
            `);

        // Verificar se encontrou o usuário
        if (result.recordset.length === 0) {

            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });

        }

        // Retornar confirmação
        res.status(200).json({
            mensagem: 'Usuário excluído com sucesso!',
            usuario: result.recordset[0]
        });

    } catch (erro) {

        console.error('Erro:', erro);

        res.status(500).json({
            erro: 'Erro ao excluir usuário',
            detalhe: erro.message
        });

    }

});


// ALTERAR
app.put('/usuarios/:id', async (req, res) => {

    // testa a os dados indo -----------

    // console.log("ID:", req.params.id);
    // console.log("BODY:", req.body);

    // res.json({
    //     id: req.params.id,
    //     dados: req.body
    // });
    //-----------------------------------

    try {

        // Pegar o ID da URL
        const id = parseInt(req.params.id);
        console.log(req.body);
        // Pegar os dados do corpo da requisição
        const {
            nome,
            email,
            telefone,
            senha,
            cpf_cnpj,
            tipo_pessoa,
            data_nasc,
            status } = req.body;



        // //     // Atualizar usuário
        const cn = await conectar();
        const result = await cn
            .request()
            .input('id', sql.Int, id)
            .input('nome', sql.VarChar(100), nome)
            .input('email', sql.VarChar(100), email)
            .input('telefone', sql.VarChar(20), telefone)
            .input('senha', sql.VarChar(255), senha)
            .input('cpf_cnpj', sql.VarChar(18), cpf_cnpj)
            .input('tipo_pessoa', sql.Char(1), tipo_pessoa)
            .input('data_nasc', sql.Date, data_nasc)
            .input('status', sql.Char(1), status)
            .query(`
                UPDATE USUARIO
                SET
                    nome = @nome,
                    email = @email,
                    telefone = @telefone,
                    senha = @senha,
                    cpf_cnpj = @cpf_cnpj,
                    tipo_pessoa = @tipo_pessoa,
                    data_nasc = @data_nasc,
                    status = @status
                OUTPUT INSERTED.*
                WHERE id_usuario = @id
            `);
       // Verificar se o usuário existe
        if (result.recordset.length === 0) {

            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });

        }

        // Retornar usuário atualizado
        res.status(200).json({
            mensagem: 'Usuário atualizado com sucesso!',
            usuario: result.recordset[0]
        });

    } catch (erro) {

        console.error('Erro:', erro);

        res.status(500).json({
            erro: 'Erro ao atualizar usuário',
            detalhe: erro.message
        });

    }

});




app.listen(port, () => {
    console.log(`Servidor http://localhost:${port}`);
}); 