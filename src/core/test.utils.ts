import { difference } from "@std/datetime";

export const getTestUtil = (): number => {
  console.log("test util with deno");

  const date0 = new Date("2018-05-14");
  const date1 = new Date("2020-05-13");
  return difference(date0, date1).years;
};
