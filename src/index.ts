import { searchInfojobs } from "./search/infojobs";
import { searchTrampos } from "./search/trampos";

console.log("hello jobs");

const main = async () => {
  // await searchTrampos();
  await searchInfojobs();
};

main();
