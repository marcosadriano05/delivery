# Deno application with Wasmbuild

This project uses Wasmbuild to compiles Rust code to WebAssembly. The
WebAssembly module contains bindings to JavaScript code use Geo library to
calculate if a pointer is inside a polygon.

## Develop

To run this project to develop is necessary:

- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- [Deno](https://deno.land/#installation)

To run the Rust tests of wasm-bindgen functions:

```
wasm-pack test --node rs_lib/
```

To compile the Rust code to Wasm:

```shell
deno task wasmbuild
```

The wasm file and js glue code are in lib folder.
