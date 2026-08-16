//https://expressjs.com/
//https://nodemon.io/
//https://expressjs.com/en/resources/middleware/cors/
//https://www.npmjs.com/package/mssql
//npm install mssql msnodesqlv8


const express = require('express');
const cors = require('cors');
let app = express();
app.use(express.json());// antigamenete era o body-parser precisa ser instalado, mas agora já vem junto com o express
let port = 3000;  

const { sql, conectar } = require('./database.js');
  
app.use(cors());

app.get('/', async (req, res) => {
    // fazer diretamente a conexão com o banco de dados
    const cn = await conectar();
    // fazer o query para testar a conexão com o banco de dados
    const result = await cn.request().query("SELECT * FROM USUARIO");
    //res.send('Conexão com o banco de dados realizada com sucesso!');    
    res.json(result.recordset);

    //res.send('Hsadasl');
});

app.listen(port, () => {
    console.log(`Servidor http://localhost:${port}`);
}); 