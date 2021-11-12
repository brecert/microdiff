import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { diff } from "../mod.ts";

Deno.test("Handles equal regex", () => {
  assertEquals(diff({ regex: /a/ }, { regex: /a/ }), []);
});

Deno.test("Handles unequal regex", () => {
  assertEquals(diff({ regex: /a/ }, { regex: /b/ }), [
    {
      type: "change",
      path: ["regex"],
      value: /b/,
    },
  ]);
});
