// ./server/tests/errorHandler.test.ts
import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { errorHandler } from "../../src/middleware/errorHandler.ts";
import { Context } from "oak/mod.ts";

Deno.test("errorHandler deve capturar erros e retornar 500", async () => {
  const ctx = {
    response: {
      status: undefined,
      body: undefined,
    },
  } as unknown as Context;

  const next = () => Promise.reject(new Error("Erro de teste"));

  await errorHandler(ctx, next);

  assertEquals(ctx.response.status, 500);
  assertEquals(ctx.response.body, {
    code: "INTERNAL_ERROR",
    message: "Ocorreu um erro interno"
  });
});