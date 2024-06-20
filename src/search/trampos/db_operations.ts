import { PATH_DB } from "../../variables/constants";
import sql from "sqlite3";
import { Opportunite } from "./types";

// name: string;
// state: string;
// city: string;
// salary: string;
// home_office: boolean | undefined | null;
// hybrid: boolean | undefined | null;
// published_at: string;
// url: string;
export const addOprotunityOnTramposTable = async (oprotunitie: Opportunite) => {
  const db = new sql.Database(PATH_DB);
  const querry = `INSERT OR IGNORE INTO trampos  
         VALUES (${oprotunitie.id},
                  '${oprotunitie.name}',
                  '${oprotunitie.state}', 
                  '${oprotunitie.city}',
                  '${oprotunitie.salary}',
                  '${oprotunitie.home_office}', 
                  '${oprotunitie.hybrid}', 
                  '${oprotunitie.published_at}', 
                  '${oprotunitie.url} '
         )`;

  await db.run(querry);
};
