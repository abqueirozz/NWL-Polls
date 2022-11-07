# add fastify (handle with http and routes - like express)
npm i fastify -D
npm i @fastify/cors

# add typescript
npm i tsx - D

put "watch" in package-json scripts

# primma ( helps to handle with databases)
npm i primsa -D (interface para automatizar tarefas no terminal)
npm i @ prisma/client (de fato o que vamos usar)
npx prisma init --datasource-provider SQLite (podendo ser outras databases)
npx prisma migrate dev (cria uma migration -> mecanismo de versionamento de tabela... como o git)
npx prisma studio (abre uma interface web para vermos as tabelas)
npm i prisma-erd-generator @mermaid-js/mermaid-cli -D ( geração de diagramas. Nesse caso o ERD)
npx prisma generate ( gera o diagrama em si )

# seed
npx prisma db seed
# schema validation
npm i zod

# If fetch dont work
npm install node-fetch

# jwt
npm install @fastify/jwt
