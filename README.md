# AEROCODE - Backend

Guia de configuração e execução do servidor API em Node/TypeScript com Prisma.

## Requisitos

- Node.js (>= 18 LTS recomendado)
- Banco MySQL acessível (local ou remoto)

## Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na pasta `backend/` com:

```
DATABASE_URL="mysql://USUARIO:SENHA@HOST:PORTA/NOME_BANCO"
PORT=3001
```

Notas:
- `DATABASE_URL` segue o formato padrão do conector MySQL do Prisma.
- `PORT` é opcional (cairá no default interno se não definido). Ajuste conforme necessidade.

Você pode usar o template em `backend/.env.example`.

## Passos de Setup

1. Instalar dependências:
	```bash
	npm install
	```
2. Gerar e aplicar migrações (cria as tabelas):
	```bash
	npx prisma migrate dev
	```

3. Gerar o Prisma Cliente:
    ```bash
	npx prisma generate
	```

4. Iniciar em modo desenvolvimento (watch + reload):
	```bash
	npm run dev
	```
5. Build e execução em produção:
	```bash
	npm run build
	npm start
	```

## Estrutura Principal

- `src/server.ts` – inicialização do servidor.
- `src/app.ts` – configuração da aplicação Express (middlewares / rotas).
- `src/routes/*` – rotas agrupadas por domínio (aeronaves, etapas, etc.).
- `prisma/schema.prisma` – modelo de dados e enums.
- `prisma/seed.ts` – lógica de povoamento inicial.

## Comandos Úteis Prisma

```bash
# Ver estado das migrações
npx prisma migrate status

# Abrir Studio (UI para verificação de dados)
npx prisma studio

# Gerar cliente após mudanças no schema
npx prisma generate
```

## Troubleshooting

- Erro de conexão: validar string em `DATABASE_URL` e se o banco está acessível.
- Mudou o schema e quer reset: (somente ambiente de desenvolvimento)
  ```bash
  npx prisma migrate reset
  ```
- Tipos não atualizados: rodar `npx prisma generate` após alterar `schema.prisma`.

## Licença

Uso educacional / acadêmico. Ajuste conforme necessário.