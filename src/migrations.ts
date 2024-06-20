import sql from "sqlite3";
import { PATH_DB } from "./variables/constants";

const db = new sql.Database(PATH_DB);

//If table 'trampos' does not exists created
db.run(`CREATE TABLE IF NOT EXISTS trampos 
         (id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          state TEXT,
          city TEXT,
          salary TEXT, 
          home_office INTEGER,
          hybrid INTEGER,
          published_at TEXT, 
          url TEXT
         )`);
