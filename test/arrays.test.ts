import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { diff } from "../mod.ts";

Deno.test("top level array & array diff", () => {
  assertEquals(diff(["test", "testing"], ["test"]), [
    {
      type: "remove",
      path: ["1"],
    },
  ]);
});

Deno.test("nested array", () => {
  assertEquals(diff(["test", ["test"]], ["test", ["test", "test2"]]), [
    {
      type: "create",
      path: ["1", "1"],
      value: "test2",
    },
  ]);
});

Deno.test("object in array in object", () => {
  assertEquals(
    diff(
      { test: ["test", { test: true }] },
      { test: ["test", { test: false }] },
    ),
    [
      {
        type: "change",
        path: ["test", "1", "test"],
        value: false,
      },
    ],
  );
});
