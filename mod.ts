export enum DiffType {
  Create = "create",
  Remove = "remove",
  Change = "change",
}

export type DiffResult = {
  type: DiffType;
  path: string[];
  value?: unknown;
};

const richTypes: Record<string, boolean> = {
  Date: true,
  RegExp: true,
  String: true,
  Number: true,
};

export function diff(
  objA: any | any[],
  objB: any | any[],
): DiffResult[] {
  const diffs: DiffResult[] = [];
  for (const key in objA) {
    if (!(key in objB)) {
      diffs.push({
        type: DiffType.Remove,
        path: [key],
      });
      continue;
    }
    // Accesssing properties while typically cheap, can add up.
    // by accessing it only once here we can avoid the cost of future checks.
    // this reduces the running time by around 5000ns on average for me.
    const keyObjA = objA[key];
    const keyObjB = objB[key];
    const typeofA = typeof keyObjA;
    const typeofB = typeof keyObjB;
    if (typeof keyObjA === "object" && keyObjA != null) {
      Reflect.getPrototypeOf(keyObjA);
    }

    if (
      keyObjA && keyObjB &&
      typeofA === "object" && typeofB === "object" &&
      // https://perf.link/#eyJpZCI6IjVlOTU5ZWJtYzgxIiwidGl0bGUiOiJGaW5kaW5nIG51bWJlcnMgaW4gYW4gYXJyYXkgb2YgMTAwMCIsImJlZm9yZSI6ImNvbnN0IGRhdGEgPSBbXG4gIFN0cmluZyxcbiAgXCJzdHJpbmdcIixcbiAgMTAwLFxuICBjbGFzcyB7IH0sXG4gIG5ldyBjbGFzcyB7IGdldCBmb28oKSB7IHJldHVybiBcImZvb1wiIH0gfSxcbiAgWyAxMCwgMTAgXSxcbiAgL3JlZ2V4cC8sXG5dXG4gICIsInRlc3RzIjpbeyJuYW1lIjoiVGVzdCBDYXNlIiwiY29kZSI6ImRhdGEubWFwKG9iaiA9PiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiID8gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihvYmopIDogbnVsbCkiLCJydW5zIjpbMzQ0MDAwLDg4MTAwMCwxNTIwMDAsMzc1MDAwLDcyMDAwMCwxMDAwLDEwMDYwMDAsODg4MDAwLDUzNjAwMCwxMTQwMDAwLDQwNzAwMCwzNjAwMCw5NzIwMDAsNzQwMDAwLDg0ODAwMCw2NjQwMDAsOTI2MDAwLDExNTAwMCwxNjcwMDAsNjU0MDAwLDc4NTAwMCw5MzEwMDAsMTA5NjAwMCwxMDUxMDAwLDcyODAwMCw3OTQwMDAsNjQ4MDAwLDI4MjAwMCw1MDcwMDAsODkxMDAwLDE1NjAwMCwxMTYwMDAsNTY5MDAwLDE5MjAwMCwxMDgxMDAwLDkzMDAwLDc5NTAwMCwxMDEyMDAwLDMzODAwMCwyNTAwMDAsNjQ5MDAwLDQ2NDAwMCwzMDIwMDAsNzM3MDAwLDY5ODAwMCwxMjUwMDAsODkyMDAwLDI4OTAwMCwxODIwMDAsNTg4MDAwLDM2MDAwMCwzNTgwMDAsODY0MDAwLDQ2MDAwLDQ0NzAwMCwxODUwMDAsOTMzMDAwLDIzNDAwMCwxMDcxMDAwLDczOTAwMCw5NDcwMDAsNDcwMDAwLDEwMDcwMDAsNTUwMDAwLDU4NzAwMCwxMTgwMDAwLDE4ODAwMCw1MzEwMDAsMTA2OTAwMCw2NDcwMDAsMTg0MDAwLDEyMjAwMCw2NzkwMDAsOTUwMDAwLDEwMjcwMDAsOTk2MDAwLDExODAwMCwzOTQwMDAsMTMxMDAwLDU1NzAwMCwzODIwMDAsMTQ0MDAwLDQ3MDAwMCw3OTcwMDAsNDIyMDAwLDIyMzAwMCwzMTkwMDAsNDU3MDAwLDI4OTAwMCw3ODAwMCw0NTkwMDAsMTEyNTAwMCwzNzAwMCw0NDIwMDAsMjY1MDAwLDc4OTAwMCwxMzAwMCw3ODUwMDAsOTc0MDAwLDI4MDAwXSwib3BzIjo1NDg4MjB9LHsibmFtZSI6IkZpbmQgaXRlbSA4MDAiLCJjb2RlIjoiZGF0YS5tYXAob2JqID0%2BIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSA6IG51bGwpIiwicnVucyI6WzMxNjAwMCw1MzUwMDAsMTEwNDAwMCw4OTYwMDAsNjEwMDAsMTcxMDAwLDI5OTAwMCwyMzAwMCwxOTkwMDAsMjk1MDAwLDI2MzAwMCw2MTIwMDAsNDQ5MDAwLDExNTAwMDAsMTAxMjAwMCwxNDgwMDAsMzY5MDAwLDQ3MjAwMCwxMzEwMDAsMTAzNzAwMCw5NzgwMDAsMzgyMDAwLDg0MDAwMCwzOTIwMDAsODk5MDAwLDEwNDgwMDAsMTcyMDAwLDEzOTAwMCwxMDg4MDAwLDkxMTAwMCw4MDYwMDAsNjc4MDAwLDMxNTAwMCwxNzgwMDAsMzQyMDAwLDEyMDQwMDAsNjc4MDAwLDY5MTAwMCw1NTQwMDAsNzc3MDAwLDgxMDAwMCwxMTQwMDAwLDk3OTAwMCwzNDcwMDAsNDM5MDAwLDY1NjAwMCw5MDkwMDAsODk0MDAwLDg4MTAwMCw1OTEwMDAsMjYwMDAsOTkxMDAwLDQ3MDAwMCw2OTUwMDAsODAyMDAwLDkxNTAwMCw4MjEwMDAsMzQ3MDAwLDcwNDAwMCwxMDYzMDAwLDQ1MTAwMCwzNDQwMDAsMTAxNTAwMCwzMjEwMDAsNTg3MDAwLDQwMjAwMCw1MTMwMDAsMjUxMDAwLDE4NDAwMCwzMDAwLDQ0NjAwMCw0OTYwMDAsOTE4MDAwLDQ1NjAwMCw1MDEwMDAsMTAwMCwxMjYwMDAsNzcwMDAwLDc0ODAwMCw4NTkwMDAsMzUwMDAsNzQ1MDAwLDExMjgwMDAsNDMwMDAsMTA5NzAwMCw2NzYwMDAsMTUwMDAsNjQwMDAsMTAwMCwxMTczMDAwLDgwMDAwMCwyNTQwMDAsNjczMDAwLDEwNzkwMDAsMTE1OTAwMCwyNzIwMDAsNTk2MDAwLDUwNzAwMCwxMDQwMDAwLDU2NDAwMF0sIm9wcyI6NTg0MDcwfV0sInVwZGF0ZWQiOiIyMDIxLTExLTA3VDAxOjI4OjMwLjUwOFoifQ%3D%3D
      // While not 100% consistent, I've found that `Reflect.getPrototypeOf` is on average a bit faster with less variation than `Object.getPrototypeOf` when testing on chrome.
      // on firefox I've found `Reflect.getPrototypeOf` to be almost always faster than `Object.getPrototypeOf`, even if not always by a large amount.
      // `Reflect.getPrototypeOf` has slightly different behavior but given we're already checking if the object is an object, the coercion was never used.
      // the running time difference isn't that noticable on node/chrome, however on firefox it should be more noticable.
      !richTypes[Reflect.getPrototypeOf(keyObjA)!.constructor.name]
    ) {
      const nestedDiffs = diff(keyObjA, keyObjB);
      // Using spreads and iterators in js can be very slow, especially on firefox
      // By applying here we can avoid the spread.
      diffs.push.apply(
        diffs,
        nestedDiffs.map((difference) => {
          difference.path.unshift(key);
          return difference;
        }),
      );
    } else if (
      keyObjA !== keyObjB &&
      !(
        typeof keyObjA === "object" &&
        typeof keyObjB === "object" &&
        (isNaN(keyObjA) ? keyObjA + "" === keyObjB + "" : +keyObjA === +keyObjB)
      )
    ) {
      diffs.push({
        path: [key],
        type: DiffType.Change,
        value: keyObjB,
      });
    }
  }
  for (const key in objB) {
    if (!(key in objA)) {
      diffs.push({
        type: DiffType.Create,
        path: [key],
        value: objB[key],
      });
    }
  }
  return diffs;
}
