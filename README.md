# Exemplo WebGIS

Projeto criado com o intuito de apresentar um exemplo básico de WebGIS. Ele utiliza [Node.js](https://nodejs.org/en/) no back-end, [jQuery](https://jquery.com/) para manipulação do DOM e [OpenLayers](https://openlayers.org/) como biblioteca para manipulação de mapas.

## Pré-requisitos:

- [Node.js](https://nodejs.org/en/) >= 6.11.0

- [npm](https://www.npmjs.com/) >= 3.10.10

- [bower](https://bower.io/) >= 1.8.0

- [PostgreSQL](https://www.postgresql.org/) >= 9.5.7

- [PostGIS](http://postgis.net/) >= 2.2.1

- [GeoServer](http://geoserver.org/) >= 2.11.1

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