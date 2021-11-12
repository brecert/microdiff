import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { diff } from "../mod.ts";

Deno.test("Handles equal dates", () => {
  assertEquals(diff({ date: new Date(1) }, { date: new Date(1) }), []);
});
Deno.test("Handles unequal dates", () => {
  assertEquals(diff({ date: new Date(1) }, { date: new Date(2) }), [
    {
      path: ["date"],
      type: "change",
      value: new Date(2),
    },
  ]);
});
Deno.test("Handles value being a date and the other not", () => {
  assertEquals(diff({ date: new Date(1) }, { date: "not date" }), [
    {
      path: ["date"],
      type: "change",
      value: "not date",
    },
  ]);
  assertEquals(diff({ date: "not date" }, { date: new Date(1) }), [
    {
      path: ["date"],
      type: "change",
      value: new Date(1),
    },
  ]);
});
