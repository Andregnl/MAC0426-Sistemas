# MAC0426-Sistemas
# Comparação de Desempenho entre MySQL e PostgreSQL

Este projeto tem como objetivo comparar o desempenho dos SGBDs MySQL e PostgreSQL.

## Visão Geral

O projeto é composto por um servidor escrito em JavaScript que realiza testes de desempenho nos SGBDs e um conjunto de scripts em Python para gerar gráficos e tabelas com os resultados dos testes.

## Estrutura do Projeto

- **JavaScript**: Cria o servidor e executa os testes de desempenho.
- **Python**: Processa e organiza os resultados dos testes.

## Arquivos Principais

- `database.js`: Arquivo onde podem ser modificadas as configurações de acesso ao ambiente dos SGBDs.
- `index.js`: Arquivo principal que inicia o servidor Node.js.
- `queries.js`: Arquivo com a rotina de como as consultas são executadas.
- `consultas/conj_consultas.js`: Arquivo onde estão definidos as consultas e indíces a serem testados.
- `resultProcess.py`: Script em Python para gerar gráficos com os resultados dos testes.
- `resultOrganizer.py`: Script em Python para organizar os resultados dos testes em tabelas.

## Configuração

1. Clone este repositório:
    ```sh
    git clone https://github.com/Andregnl/MAC0426-Sistemas.git
    ```

2. Instale as dependências necessárias para o Node.js:
    ```sh
    cd MAC0426-Sistemas
    npm install
    ```

3. Configure as credenciais dos SGBDs no arquivo `database.js`:
    ```js
        mysql: {
            host: 'localhost',
            user: 'root',
            password: 'sua-senha',
            database: 'nome-do-banco'
        },
        postgres: {
            host: 'localhost',
            user: 'postgres',
            password: 'sua-senha',
            database: 'nome-do-banco'
        }
    ```

## Uso

### Iniciar o Servidor

Para iniciar o servidor e executar os testes de desempenho, rode o seguinte comando no terminal:

```sh
node index.js
```

Os testes podem ser acessados através do endpoint:
```
http://localhost:3080/
```

Os resultados dos testes serão gerados na pasta `results`.

### Gerar Gráficos e Tabelas

Após os testes serem realizados e os dados estarem na pasta `results`, você pode gerar gráficos e tabelas executando os seguintes comandos:

```sh
python3 resultProcess.py
python3 resultOrganizer.py
```

