import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { diff } from "../mod.ts";

Deno.test("Handles equal string classes", () => {
  assertEquals(
    diff({ string: new String("hi") }, { string: new String("hi") }),
    [],
  );
});

Deno.test("Handles equal number classes", () => {
  assertEquals(diff({ number: new Number(1) }, { number: new Number(1) }), []);
});

Deno.test("Handles unequal number classes", () => {
  assertEquals(diff({ number: new Number(1) }, { number: new Number(2) }), [
    {
      type: "change",
      path: ["number"],
      value: new Number(2),
    },
  ]);
});
