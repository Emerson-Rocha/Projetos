

IF DB_ID(N'GESTAO_ANIMAL') IS NULL
BEGIN
    CREATE DATABASE GESTAO_ANIMAL;
END
GO

USE GESTAO_ANIMAL;
GO

/* =========================
   USUÁRIOS E SEGURANÇA
   ========================= */

CREATE TABLE dbo.USUARIO (
    id_usuario      INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    telefone        VARCHAR(20) NULL,
    senha           VARCHAR(255) NOT NULL,
    cpf_cnpj        VARCHAR(18) NULL,
    tipo_pessoa     CHAR(1) NOT NULL,
    data_nasc       DATE NULL,
    data_cadastro   DATETIME NOT NULL CONSTRAINT DF_USUARIO_DATA_CADASTRO DEFAULT GETDATE(),
    status          CHAR(1) NOT NULL CONSTRAINT DF_USUARIO_STATUS DEFAULT 'A',

    CONSTRAINT PK_USUARIO PRIMARY KEY (id_usuario) ,
    CONSTRAINT UQ_USUARIO_EMAIL UNIQUE (email),
    CONSTRAINT UQ_USUARIO_CPF_CNPJ UNIQUE (cpf_cnpj),
    CONSTRAINT CK_USUARIO_TIPO_PESSOA CHECK (tipo_pessoa IN ('F','J')),
    CONSTRAINT CK_USUARIO_STATUS CHECK (status IN ('A','I'))
);
GO

CREATE TABLE dbo.ENDERECO (
    id_endereco     INT IDENTITY(1,1) NOT NULL,
    id_usuario      INT NOT NULL,
    cep             VARCHAR(10) NULL,
    logradouro      VARCHAR(120) NULL,
    numero          VARCHAR(10) NULL,
    complemento     VARCHAR(60) NULL,
    bairro          VARCHAR(60) NULL,
    cidade          VARCHAR(60) NULL,
    uf              CHAR(2) NULL,

    CONSTRAINT PK_ENDERECO PRIMARY KEY (id_endereco),
    CONSTRAINT FK_ENDERECO_USUARIO
        FOREIGN KEY (id_usuario) REFERENCES dbo.USUARIO(id_usuario)
);
GO

CREATE TABLE dbo.FUNCAO (
    id_funcao       INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(60) NOT NULL,
    descricao       VARCHAR(255) NULL,

    CONSTRAINT PK_FUNCAO PRIMARY KEY (id_funcao),
    CONSTRAINT UQ_FUNCAO_NOME UNIQUE (nome)
);
GO

CREATE TABLE dbo.USUARIO_FUNCAO (
    id_usuario      INT NOT NULL,
    id_funcao       INT NOT NULL,
    data_inicio     DATE NOT NULL,
    data_fim        DATE NULL,

    CONSTRAINT PK_USUARIO_FUNCAO PRIMARY KEY (id_usuario, id_funcao),
    CONSTRAINT FK_USUARIO_FUNCAO_USUARIO
        FOREIGN KEY (id_usuario) REFERENCES dbo.USUARIO(id_usuario),
    CONSTRAINT FK_USUARIO_FUNCAO_FUNCAO
        FOREIGN KEY (id_funcao) REFERENCES dbo.FUNCAO(id_funcao),
    CONSTRAINT CK_USUARIO_FUNCAO_DATAS
        CHECK (data_fim IS NULL OR data_fim >= data_inicio)
);
GO

CREATE TABLE dbo.PERMISSAO (
    id_permissao    INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(60) NOT NULL,
    descricao       VARCHAR(255) NULL,

    CONSTRAINT PK_PERMISSAO PRIMARY KEY (id_permissao),
    CONSTRAINT UQ_PERMISSAO_NOME UNIQUE (nome)
);
GO

CREATE TABLE dbo.USUARIO_PERMISSAO (
    id_usuario      INT NOT NULL,
    id_permissao    INT NOT NULL,

    CONSTRAINT PK_USUARIO_PERMISSAO PRIMARY KEY (id_usuario, id_permissao),
    CONSTRAINT FK_USUARIO_PERMISSAO_USUARIO
        FOREIGN KEY (id_usuario) REFERENCES dbo.USUARIO(id_usuario),
    CONSTRAINT FK_USUARIO_PERMISSAO_PERMISSAO
        FOREIGN KEY (id_permissao) REFERENCES dbo.PERMISSAO(id_permissao)
);
GO

/* =========================
   ANIMAIS E ADOÇÃO
   ========================= */

CREATE TABLE dbo.ANIMAL (
    id_animal       INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    especie         VARCHAR(50) NOT NULL,
    raca            VARCHAR(60) NULL,
    sexo            CHAR(1) NULL,
    porte           VARCHAR(10) NULL,
    idade           INT NULL,
    peso            DECIMAL(5,2) NULL,
    cor             VARCHAR(50) NULL,
    microchip       VARCHAR(30) NULL,
    castrado        BIT NOT NULL CONSTRAINT DF_ANIMAL_CASTRADO DEFAULT 0,
    vacinado        BIT NOT NULL CONSTRAINT DF_ANIMAL_VACINADO DEFAULT 0,
    data_entrada    DATE NULL,
    origem          VARCHAR(80) NULL,
    status          VARCHAR(20) NOT NULL,
    observacao      VARCHAR(255) NULL,

    CONSTRAINT PK_ANIMAL PRIMARY KEY (id_animal),
    CONSTRAINT UQ_ANIMAL_MICROCHIP UNIQUE (microchip),
    CONSTRAINT CK_ANIMAL_SEXO CHECK (sexo IS NULL OR sexo IN ('M','F')),
    CONSTRAINT CK_ANIMAL_PORTE CHECK (porte IS NULL OR porte IN ('P','M','G')),
    CONSTRAINT CK_ANIMAL_IDADE CHECK (idade IS NULL OR idade >= 0),
    CONSTRAINT CK_ANIMAL_PESO CHECK (peso IS NULL OR peso >= 0),
    CONSTRAINT CK_ANIMAL_STATUS CHECK (
        status IN ('Disponível','Adotado','Em Tratamento','Óbito')
    )
);
GO

CREATE TABLE dbo.ANIMAL_USUARIO (
    id_animal       INT NOT NULL,
    id_usuario      INT NOT NULL,
    tipo_relacao    VARCHAR(20) NOT NULL,
    data_inicio     DATE NOT NULL,
    data_fim        DATE NULL,

    CONSTRAINT PK_ANIMAL_USUARIO PRIMARY KEY (id_animal, id_usuario),
    CONSTRAINT FK_ANIMAL_USUARIO_ANIMAL
        FOREIGN KEY (id_animal) REFERENCES dbo.ANIMAL(id_animal),
    CONSTRAINT FK_ANIMAL_USUARIO_USUARIO
        FOREIGN KEY (id_usuario) REFERENCES dbo.USUARIO(id_usuario),
    CONSTRAINT CK_ANIMAL_USUARIO_DATAS
        CHECK (data_fim IS NULL OR data_fim >= data_inicio)
);
GO

CREATE TABLE dbo.FOTO (
    id_foto         INT IDENTITY(1,1) NOT NULL,
    id_animal       INT NOT NULL,
    url_foto        VARCHAR(255) NOT NULL,
    principal       BIT NOT NULL CONSTRAINT DF_FOTO_PRINCIPAL DEFAULT 0,
    data_cadastro   DATETIME NOT NULL CONSTRAINT DF_FOTO_DATA_CADASTRO DEFAULT GETDATE(),

    CONSTRAINT PK_FOTO PRIMARY KEY (id_foto),
    CONSTRAINT FK_FOTO_ANIMAL
        FOREIGN KEY (id_animal) REFERENCES dbo.ANIMAL(id_animal)
);
GO

CREATE TABLE dbo.SOLICITACAO_ADOCAO (
    id_solicitacao  INT IDENTITY(1,1) NOT NULL,
    id_usuario      INT NOT NULL,
    data_solicitacao DATETIME NOT NULL CONSTRAINT DF_SOLICITACAO_DATA DEFAULT GETDATE(),
    status          VARCHAR(20) NOT NULL,
    observacao      VARCHAR(255) NULL,

    CONSTRAINT PK_SOLICITACAO_ADOCAO PRIMARY KEY (id_solicitacao),
    CONSTRAINT FK_SOLICITACAO_ADOCAO_USUARIO
        FOREIGN KEY (id_usuario) REFERENCES dbo.USUARIO(id_usuario),
    CONSTRAINT CK_SOLICITACAO_ADOCAO_STATUS CHECK (
        status IN ('Aguardando','Aprovada','Rejeitada','Cancelada')
    )
);
GO

CREATE TABLE dbo.SOLICITACAO_ANIMAL (
    id_solicitacao  INT NOT NULL,
    id_animal       INT NOT NULL,

    CONSTRAINT PK_SOLICITACAO_ANIMAL PRIMARY KEY (id_solicitacao, id_animal),
    CONSTRAINT FK_SOLICITACAO_ANIMAL_SOLICITACAO
        FOREIGN KEY (id_solicitacao) REFERENCES dbo.SOLICITACAO_ADOCAO(id_solicitacao),
    CONSTRAINT FK_SOLICITACAO_ANIMAL_ANIMAL
        FOREIGN KEY (id_animal) REFERENCES dbo.ANIMAL(id_animal)
);
GO

CREATE TABLE dbo.ADOTACAO (
    id_adocao       INT IDENTITY(1,1) NOT NULL,
    id_solicitacao  INT NOT NULL,
    id_animal       INT NOT NULL,
    id_adotante     INT NOT NULL,
    data_adocao     DATE NOT NULL,
    termo_assinado  BIT NOT NULL CONSTRAINT DF_ADOCAO_TERMO DEFAULT 0,
    observacao      VARCHAR(255) NULL,

    CONSTRAINT PK_ADOTACAO PRIMARY KEY (id_adocao),
    CONSTRAINT FK_ADOCAO_SOLICITACAO
        FOREIGN KEY (id_solicitacao) REFERENCES dbo.SOLICITACAO_ADOCAO(id_solicitacao),
    CONSTRAINT FK_ADOCAO_ANIMAL
        FOREIGN KEY (id_animal) REFERENCES dbo.ANIMAL(id_animal),
    CONSTRAINT FK_ADOCAO_ADOTANTE
        FOREIGN KEY (id_adotante) REFERENCES dbo.USUARIO(id_usuario)
);
GO

/* =========================
   SAÚDE / PRONTUÁRIO
   ========================= */

CREATE TABLE dbo.PROFISSIONAL (
    id_profissional INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    tipo            VARCHAR(30) NOT NULL,
    registro        VARCHAR(30) NULL,
    telefone        VARCHAR(20) NULL,
    email           VARCHAR(100) NULL,

    CONSTRAINT PK_PROFISSIONAL PRIMARY KEY (id_profissional)
);
GO

CREATE TABLE dbo.PRONTUARIO (
    id_prontuario   INT IDENTITY(1,1) NOT NULL,
    id_animal       INT NOT NULL,
    id_profissional INT NOT NULL,
    data_atendimento DATETIME NOT NULL,
    descricao       VARCHAR(MAX) NULL,
    observacao      VARCHAR(255) NULL,

    CONSTRAINT PK_PRONTUARIO PRIMARY KEY (id_prontuario),
    CONSTRAINT FK_PRONTUARIO_ANIMAL
        FOREIGN KEY (id_animal) REFERENCES dbo.ANIMAL(id_animal),
    CONSTRAINT FK_PRONTUARIO_PROFISSIONAL
        FOREIGN KEY (id_profissional) REFERENCES dbo.PROFISSIONAL(id_profissional)
);
GO

CREATE TABLE dbo.DOENCA (
    id_doenca       INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(80) NOT NULL,
    descricao       VARCHAR(255) NULL,

    CONSTRAINT PK_DOENCA PRIMARY KEY (id_doenca),
    CONSTRAINT UQ_DOENCA_NOME UNIQUE (nome)
);
GO

CREATE TABLE dbo.PRONTUARIO_DOENCA (
    id_prontuario   INT NOT NULL,
    id_doenca       INT NOT NULL,
    data_diagnostico DATE NOT NULL,
    tratamento      VARCHAR(255) NULL,
    observacao      VARCHAR(255) NULL,

    CONSTRAINT PK_PRONTUARIO_DOENCA PRIMARY KEY (id_prontuario, id_doenca),
    CONSTRAINT FK_PRONTUARIO_DOENCA_PRONTUARIO
        FOREIGN KEY (id_prontuario) REFERENCES dbo.PRONTUARIO(id_prontuario),
    CONSTRAINT FK_PRONTUARIO_DOENCA_DOENCA
        FOREIGN KEY (id_doenca) REFERENCES dbo.DOENCA(id_doenca)
);
GO

CREATE TABLE dbo.FABRICANTE (
    id_fabricante   INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    pais            VARCHAR(60) NULL,

    CONSTRAINT PK_FABRICANTE PRIMARY KEY (id_fabricante)
);
GO

CREATE TABLE dbo.VACINA (
    id_vacina       INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    descricao       VARCHAR(255) NULL,

    CONSTRAINT PK_VACINA PRIMARY KEY (id_vacina),
    CONSTRAINT UQ_VACINA_NOME UNIQUE (nome)
);
GO

CREATE TABLE dbo.LOTE_VACINA (
    id_lote_vacina  INT IDENTITY(1,1) NOT NULL,
    id_vacina       INT NOT NULL,
    id_fabricante   INT NULL,
    numero_lote     VARCHAR(30) NOT NULL,
    data_fabricacao DATE NULL,
    data_validade   DATE NOT NULL,
    quantidade_total INT NOT NULL,
    quantidade_disponivel INT NOT NULL,

    CONSTRAINT PK_LOTE_VACINA PRIMARY KEY (id_lote_vacina),
    CONSTRAINT FK_LOTE_VACINA_VACINA
        FOREIGN KEY (id_vacina) REFERENCES dbo.VACINA(id_vacina),
    CONSTRAINT FK_LOTE_VACINA_FABRICANTE
        FOREIGN KEY (id_fabricante) REFERENCES dbo.FABRICANTE(id_fabricante),
    CONSTRAINT UQ_LOTE_VACINA_NUMERO UNIQUE (numero_lote),
    CONSTRAINT CK_LOTE_VACINA_QTD CHECK (
        quantidade_total >= 0 AND
        quantidade_disponivel >= 0 AND
        quantidade_disponivel <= quantidade_total
    ),
    CONSTRAINT CK_LOTE_VACINA_DATAS CHECK (
        data_fabricacao IS NULL OR data_validade >= data_fabricacao
    )
);
GO

CREATE TABLE dbo.VACINA_APLICADA (
    id_vacina_aplicada INT IDENTITY(1,1) NOT NULL,
    id_lote_vacina  INT NOT NULL,
    id_profissional INT NOT NULL,
    observacao      VARCHAR(255) NULL,

    CONSTRAINT PK_VACINA_APLICADA PRIMARY KEY (id_vacina_aplicada),
    CONSTRAINT FK_VACINA_APLICADA_LOTE
        FOREIGN KEY (id_lote_vacina) REFERENCES dbo.LOTE_VACINA(id_lote_vacina),
    CONSTRAINT FK_VACINA_APLICADA_PROFISSIONAL
        FOREIGN KEY (id_profissional) REFERENCES dbo.PROFISSIONAL(id_profissional)
);
GO

CREATE TABLE dbo.PRONTUARIO_VACINA (
    id_prontuario       INT NOT NULL,
    id_vacina_aplicada  INT NOT NULL,
    data_aplicacao      DATE NOT NULL,
    proxima_data        DATE NULL,
    observacao          VARCHAR(255) NULL,

    CONSTRAINT PK_PRONTUARIO_VACINA PRIMARY KEY (id_prontuario, id_vacina_aplicada),
    CONSTRAINT FK_PRONTUARIO_VACINA_PRONTUARIO
        FOREIGN KEY (id_prontuario) REFERENCES dbo.PRONTUARIO(id_prontuario),
    CONSTRAINT FK_PRONTUARIO_VACINA_APLICADA
        FOREIGN KEY (id_vacina_aplicada) REFERENCES dbo.VACINA_APLICADA(id_vacina_aplicada),
    CONSTRAINT CK_PRONTUARIO_VACINA_DATAS
        CHECK (proxima_data IS NULL OR proxima_data >= data_aplicacao)
);
GO

/* =========================
   ESTOQUE / PRODUTOS
   ========================= */

CREATE TABLE dbo.PRODUTO (
    id_produto      INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    categoria       VARCHAR(50) NULL,
    unidade         VARCHAR(20) NULL,
    descricao       VARCHAR(255) NULL,

    CONSTRAINT PK_PRODUTO PRIMARY KEY (id_produto)
);
GO

CREATE TABLE dbo.FORNECEDOR (
    id_fornecedor   INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    cnpj            VARCHAR(18) NULL,
    telefone        VARCHAR(20) NULL,
    email           VARCHAR(100) NULL,

    CONSTRAINT PK_FORNECEDOR PRIMARY KEY (id_fornecedor),
    CONSTRAINT UQ_FORNECEDOR_CNPJ UNIQUE (cnpj)
);
GO

CREATE TABLE dbo.ENTRADA_ESTOQUE (
    id_entrada      INT IDENTITY(1,1) NOT NULL,
    id_fornecedor   INT NOT NULL,
    data_entrada    DATE NOT NULL,
    nota_fiscal     VARCHAR(50) NULL,
    valor_total     DECIMAL(10,2) NOT NULL,

    CONSTRAINT PK_ENTRADA_ESTOQUE PRIMARY KEY (id_entrada),
    CONSTRAINT FK_ENTRADA_ESTOQUE_FORNECEDOR
        FOREIGN KEY (id_fornecedor) REFERENCES dbo.FORNECEDOR(id_fornecedor),
    CONSTRAINT CK_ENTRADA_ESTOQUE_VALOR CHECK (valor_total >= 0)
);
GO

CREATE TABLE dbo.ENTRADA_ESTOQUE_ITEM (
    id_entrada      INT NOT NULL,
    id_produto      INT NOT NULL,
    quantidade      DECIMAL(10,2) NOT NULL,
    valor_unitario  DECIMAL(10,2) NOT NULL,

    CONSTRAINT PK_ENTRADA_ESTOQUE_ITEM PRIMARY KEY (id_entrada, id_produto),
    CONSTRAINT FK_ENTRADA_ESTOQUE_ITEM_ENTRADA
        FOREIGN KEY (id_entrada) REFERENCES dbo.ENTRADA_ESTOQUE(id_entrada),
    CONSTRAINT FK_ENTRADA_ESTOQUE_ITEM_PRODUTO
        FOREIGN KEY (id_produto) REFERENCES dbo.PRODUTO(id_produto),
    CONSTRAINT CK_ENTRADA_ITEM_QTD CHECK (quantidade > 0),
    CONSTRAINT CK_ENTRADA_ITEM_VALOR CHECK (valor_unitario >= 0)
);
GO

CREATE TABLE dbo.LOTE_PRODUTO (
    id_lote         INT IDENTITY(1,1) NOT NULL,
    id_produto      INT NOT NULL,
    numero_lote     VARCHAR(30) NOT NULL,
    data_validade   DATE NULL,
    quantidade_atual DECIMAL(10,2) NOT NULL,

    CONSTRAINT PK_LOTE_PRODUTO PRIMARY KEY (id_lote),
    CONSTRAINT FK_LOTE_PRODUTO_PRODUTO
        FOREIGN KEY (id_produto) REFERENCES dbo.PRODUTO(id_produto),
    CONSTRAINT UQ_LOTE_PRODUTO_NUMERO UNIQUE (id_produto, numero_lote),
    CONSTRAINT CK_LOTE_PRODUTO_QTD CHECK (quantidade_atual >= 0)
);
GO

CREATE TABLE dbo.MOVIMENTACAO (
    id_movimentacao INT IDENTITY(1,1) NOT NULL,
    id_lote         INT NOT NULL,
    tipo            VARCHAR(20) NOT NULL,
    data_mov        DATETIME NOT NULL CONSTRAINT DF_MOVIMENTACAO_DATA DEFAULT GETDATE(),
    quantidade      DECIMAL(10,2) NOT NULL,
    observacao      VARCHAR(255) NULL,

    CONSTRAINT PK_MOVIMENTACAO PRIMARY KEY (id_movimentacao),
    CONSTRAINT FK_MOVIMENTACAO_LOTE
        FOREIGN KEY (id_lote) REFERENCES dbo.LOTE_PRODUTO(id_lote),
    CONSTRAINT CK_MOVIMENTACAO_TIPO CHECK (
        tipo IN ('Entrada','Saída','Ajuste')
    ),
    CONSTRAINT CK_MOVIMENTACAO_QTD CHECK (quantidade > 0)
);
GO

/* =========================
   ÍNDICES PARA FKs / BUSCAS
   ========================= */

CREATE INDEX IX_ENDERECO_ID_USUARIO
    ON dbo.ENDERECO(id_usuario);

CREATE INDEX IX_USUARIO_FUNCAO_ID_FUNCAO
    ON dbo.USUARIO_FUNCAO(id_funcao);

CREATE INDEX IX_USUARIO_PERMISSAO_ID_PERMISSAO
    ON dbo.USUARIO_PERMISSAO(id_permissao);

CREATE INDEX IX_ANIMAL_USUARIO_ID_USUARIO
    ON dbo.ANIMAL_USUARIO(id_usuario);

CREATE INDEX IX_FOTO_ID_ANIMAL
    ON dbo.FOTO(id_animal);

CREATE INDEX IX_SOLICITACAO_ADOCAO_ID_USUARIO
    ON dbo.SOLICITACAO_ADOCAO(id_usuario);

CREATE INDEX IX_SOLICITACAO_ANIMAL_ID_ANIMAL
    ON dbo.SOLICITACAO_ANIMAL(id_animal);

CREATE INDEX IX_ADOCAO_ID_ANIMAL
    ON dbo.ADOTACAO(id_animal);

CREATE INDEX IX_ADOCAO_ID_ADOTANTE
    ON dbo.ADOTACAO(id_adotante);

CREATE INDEX IX_PRONTUARIO_ID_ANIMAL
    ON dbo.PRONTUARIO(id_animal);

CREATE INDEX IX_PRONTUARIO_ID_PROFISSIONAL
    ON dbo.PRONTUARIO(id_profissional);

CREATE INDEX IX_PRONTUARIO_DOENCA_ID_DOENCA
    ON dbo.PRONTUARIO_DOENCA(id_doenca);

CREATE INDEX IX_LOTE_VACINA_ID_VACINA
    ON dbo.LOTE_VACINA(id_vacina);

CREATE INDEX IX_LOTE_VACINA_ID_FABRICANTE
    ON dbo.LOTE_VACINA(id_fabricante);

CREATE INDEX IX_VACINA_APLICADA_ID_LOTE
    ON dbo.VACINA_APLICADA(id_lote_vacina);

CREATE INDEX IX_VACINA_APLICADA_ID_PROFISSIONAL
    ON dbo.VACINA_APLICADA(id_profissional);

CREATE INDEX IX_PRONTUARIO_VACINA_ID_VACINA
    ON dbo.PRONTUARIO_VACINA(id_vacina_aplicada);

CREATE INDEX IX_ENTRADA_ESTOQUE_ID_FORNECEDOR
    ON dbo.ENTRADA_ESTOQUE(id_fornecedor);

CREATE INDEX IX_ENTRADA_ESTOQUE_ITEM_ID_PRODUTO
    ON dbo.ENTRADA_ESTOQUE_ITEM(id_produto);

CREATE INDEX IX_LOTE_PRODUTO_ID_PRODUTO
    ON dbo.LOTE_PRODUTO(id_produto);

CREATE INDEX IX_MOVIMENTACAO_ID_LOTE
    ON dbo.MOVIMENTACAO(id_lote);
GO

/*
===============================================================================
CONSULTA DE CONFERÊNCIA DAS TABELAS
===============================================================================
*/

SELECT
    TABLE_SCHEMA,
    TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO
