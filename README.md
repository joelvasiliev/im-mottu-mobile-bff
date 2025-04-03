# Início

Essa é a documentação da primeira etapa do desafio para a Mottu.
Nesse desafio implementei três modulos: cats, rickandmorty e pairs.

# Como rodar o projeto?

Para rodar o projeto, execute os seguintes passos:
Com docker:

```
docker build -t mottu-bff .
docker run -d -p 3000:3000 --name mottu-bff minha-api-nest
```

Sem docker:

```
npm install
npm run build
npm run start
```

# Swagger

Implementei também a documentação da API utilizando Swagger. Ela pode ser acessada [clicando aqui](http://localhost:3000/api/docs) OU acessando http://127.0.0.1:3000/api/docs

# Como executar os testes?

Como ferramenta de testes eu utilizei o Jest.
Para rodar todos os testes unitários do projeto, rode o comando ``npm run test` da raiz do projeto.
Você também pode testar algum arquivo de teste específico digitando o nome dele após o 'test'. Exemplo: `npm run test cats`
Quando você roda o Dockerfile (como na seção "Como rodar o projeto? - Com docker") ele automaticamente executa os testes unitários antes de buildar e rodar a API.

# Como testar as rotas?

As rotas podem ser testadas tanto por alguma ferramenta externa (Ex: Postman, Insomnia, entre outros) quanto diretamente pelo Swagger.

# Decisões técnicas tomadas

Para desenvolver esse desafio, eu optei por separar cada escopo por módulo, e manter os arquivos de testes dentro das respectivas pastas para facilitar a visualização e manutenção desse código.
Além disso, o swagger foi implementado visando facilitar o entendimento das rotas, com exemplos práticos e uma breve descrição de funcionalidade, além de conseguir testar a rota diretamente pelo Swagger.
Para as requisições de APIs externas eu utilizei o Axios com HttpModule do NestJS.
Criei o Dockerfile também para facilitar a instalação, além de isolar as dependências (SO e versões de node, npm, etc.) do projeto.
