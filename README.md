# Schild

## Before start the api server

```bash
> npm install
```

- For now, you need to have at least the PostgreSQL 9.4 installed locally (docker deployment is comming soon)
- You can set the environment variables on `.env.environment`
- Then you need to run the migrations

### Run Migrations

```bash
> npm run migrate up
```

## Start api server

```bash
> npm start api
```

then you can check the following endpoints

```
http://localhost:3333/boards
http://localhost:3333/boards/1
```
