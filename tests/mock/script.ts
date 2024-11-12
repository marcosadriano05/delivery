// Scrtip to populate the database
// Run this script with deno run --allow-net --allow-env script.ts
// Run when the server is running

import pdvs from "./pdvs.json" with { type: "json" };

const data = pdvs.pdvs;
data.forEach(async (value) => {
  const a = structuredClone(value);
  a.id = Number(value.id);
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  await fetch("https://marcosadriano05-delivery.deno.dev/partner", {
    method: "post",
    headers,
    body: JSON.stringify(a),
  });
});
