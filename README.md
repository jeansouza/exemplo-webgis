# Exemplo WebGIS

Projeto criado com o intuito de apresentar um exemplo básico de WebGIS.

## Pré-requisitos:

- Node.js >= 6.11.0

- npm >= 3.10.10

- bower >= 1.8.0

- PostgreSQL >= 9.5.7

- PostGIS >= 2.2.1

- GeoServer >= 2.11.1

## Instruções

1- Clone o projeto:

```
$ git clone https://github.com/jeansouza/exemplo-webgis
```

2- Acesse a pasta do projeto:

```
$ cd exemplo-webgis
```

3- Faça a instalação das dependências npm:

```
$ npm install
```

4- Faça a instalação das dependências bower:

```
$ bower install
```

5- Crie o banco de dados:

```
$ psql -h localhost -U postgres -a -f bd.sql
```

6- Crie a camada estados no GeoServer.

7- Execute o projeto:

```
$ npm start
```

A aplicação vai estar acessível na porta 3000:

http://localhost:3000