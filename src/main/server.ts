import { app } from "./app.ts";
import { client } from "../infra/postgres.ts";

client.connect();

app.listen(5000, () => console.log("Server up on port 5000"));
