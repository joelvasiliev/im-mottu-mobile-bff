# Início

Essa é a documentação da segunda etapa do desafio para a Mottu.
Nessa etapa do desafio eu implementei alguns filtros para a rota GET - /v1/pairs/search, adicionei a rota GET - /v1/cats/breeds para listar as raças de gatos disponíveis, implementei o redis para controle de cache com docker, subi também o arquivo docker-compose para subir a API junto com o redis.

# Como rodar o projeto?

Para rodar o projeto, execute os seguintes passos:
Com docker:

```
docker-compose up
```

Sem docker: (Precisa ter o redis rodando e configurar corretamente as credenciais no .env)

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

# Decisões técnicas tomadas - Nível 1

Para desenvolver esse desafio, eu optei por separar cada escopo por módulo, e manter os arquivos de testes dentro das respectivas pastas para facilitar a visualização e manutenção desse código.
Além disso, o swagger foi implementado visando facilitar o entendimento das rotas, com exemplos práticos e uma breve descrição de funcionalidade, além de conseguir testar a rota diretamente pelo Swagger.
Para as requisições de APIs externas eu utilizei o Axios com HttpModule do NestJS.
Criei o Dockerfile também para facilitar a instalação, além de isolar as dependências (SO e versões de node, npm, etc.) do projeto.

# Decisões técnicas tomadas - Nível 2

Aqui eu implementei o Redis por ter um melhor controle do cache, e resolvi deixar o docker-compose para facilitar a integração entre eles em diferentes ambientes, já com as variáveis de ambiente configuradas e a network para comunicação entre os containers.
Além disso, implementei cache nas services de listar raças de gatos e de obter personagem por ID visando economizar requisições e prevenir erros da API fora do ar ou problemas internos.

Separei os módulos em pastas seguindo DDD / Clean Code, visando escalabilidade do projeto, e seguindo as melhores práticas com Nest JS para a arquitetura do projeto.
Também criei um módulo de usuários para futuramente implementar autenticação para algumas rotas ficarem protegidas.
