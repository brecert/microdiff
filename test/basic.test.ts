import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { diff } from "../mod.ts";

Deno.test("new raw value", () => {
  assertEquals(diff({ test: true }, { test: true, test2: true }), [
    {
      type: "create",
      path: ["test2"],
      value: true,
    },
  ]);
});
Deno.test("change raw value", () => {
  assertEquals(diff({ test: true }, { test: false }), [
    {
      type: "change",
      path: ["test"],
      value: false,
    },
  ]);
});
Deno.test("remove raw value", () => {
  assertEquals(diff({ test: true, test2: true }, { test: true }), [
    {
      type: "remove",
      path: ["test2"],
    },
  ]);
});

Deno.test("replace object with null", () => {
  assertEquals(diff({ object: { test: true } }, { object: null }), [
    {
      type: "change",
      path: ["object"],
      value: null,
    },
  ]);
});

Deno.test("replace object with other value", () => {
  assertEquals(diff({ object: { test: true } }, { object: "string" }), [
    {
      type: "change",
      path: ["object"],
      value: "string",
    },
  ]);
});
