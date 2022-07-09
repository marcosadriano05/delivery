# Delivery application

## Abstract

This project solves the
[backend challenge](https://github.com/ZXVentures/ze-code-challenges/blob/master/backend.md),
who the main purpose is to create and find a partner and search for the nearest
partner for the given latitude and longitude.

This project are made using Deno for the API, Wasmbuild to compiles a library in
Rust code to WebAssembly, this library uses [Geo](https://crates.io/crates/geo)
crate to calculate if a pointer is inside a polygon. The project are hosted on
Deno Deploy and the Postgres database on Supabase.

## Production

The API is available at this [link](https://marcosadriano05-delivery.deno.dev/).

Obs: The database has populated with the fake data provided by the challenge
repository.

The API is hosted on [Deno Deploy](https://deno.com/deploy). The database is
hosted on [Supabase](https://supabase.com/).

### API

Exemple of an partner in Json format:

```json
{
  "id": 1,
  "tradingName": "Trading Name",
  "ownerName": "Owner Name",
  "document": "999999999999",
  "address": {
    "id": 1,
    "type": "Point",
    "coordinates": [
      -46.588654,
      -23.709635
    ]
  },
  "coverageArea": {
    "id": 1,
    "type": "MultiPolygon",
    "coordinates": [[[[10, 10], [10, 10]]]]
  }
}
```

- `/partner/:id GET`

Returns an partner who matches the route param id.

- `/partner GET`

Returns all partners in an json array.

- `/partner POST`

Save a partner.

Body:

```json
{
  "tradingName": "Trading Name",
  "ownerName": "Owner Name",
  "document": "999999999999",
  "address": {
    "type": "Point",
    "coordinates": [
      -46.588654,
      -23.709635
    ]
  },
  "coverageArea": {
    "type": "MultiPolygon",
    "coordinates": [[[[10, 10], [10, 10]]]]
  }
}
```

- `/partner/nearest POST`

Returns the nearest partner who cover the given latitude and longitude.

Body:

```json
{
  "lat": 10,
  "lon": 10
}
```

## Develop

To run this project locally is necessary:

- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- [Deno](https://deno.land/#installation)
- [Postgres](https://www.postgresql.org/)

### Rust (WebAssembly)

The Rust code is on the `rs_lib` directory, it contains the binding functions to
interate with Javascript. The code uses the function of Geo crate to calculate
if a point is inside a polygon.

To compile the Rust code to Wasm:

```shell
deno task wasmbuild
```

After this compilation, the `lib` directory is generated and the Wasm file and
Javascript file with the functions who interates to wasm are in this folder.

To run the Rust tests of wasm-bindgen functions:

```
wasm-pack test --node rs_lib/
```

### Deno

The application is built in on Deno, the code is structured to the outside
libraries interact to user code through interfaces. This improve testability and
facilitates to switching libraries if necessary.

To setup the project, is necessary to have a Postgres database running, the
`env.ts` on root directory has default environment variables to connect to
database that can be modified.

To create all the tables on the database, run the migrations by the command:

```shell
deno task migration:run
```

After this, the project is ready to run.

To run tests:

```shell
deno task test
```

To run the project:

```shell
deno task run
```

## Points to imporve

- Create an script to setup an container Docker with Postgres to run integration
  tests on the database.

- Integrate this setup and integration tests on Github Actions on push or pull
  on branch main.

- Be able to Deploy only if all the CI pipeline are ok.

- Integrate the migrations with Supabase migrations to automatic edit the
  database hosted on Supabase.
