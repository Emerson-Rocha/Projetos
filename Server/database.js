// importar o módulo do SQL Server
//const sql = require('mssql');
const sql = require("mssql/msnodesqlv8");
const database = {
    //user: '',
    //password: '',
    server: 'DESKTOP-EUERDMF\\SQLEXPRESS',
    database: "GESTAO_ANIMAL",
    options: {
        encrypt: false,// Significa que a conexão não exige criptografia TLS.
        trustServerCertificate: true, //alidar o certificado digital apresentado pelo SQL Serve
        trustedConnection: true
    },
driver: "ODBC Driver 17 for SQL Server"
}


async function conectar() {

    try {

        const db = await sql.connect(database);
        console.log("✅ SQL Server conectado!");
        console.log("📊 Banco: GESTAO_ANIMAL");
        return db;

    } catch (error) {

        console.error("❌ Erro ao conectar:");
        console.error(error.message);
          throw erro;

    }
}

module.exports = {sql,conectar };