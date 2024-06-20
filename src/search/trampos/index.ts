import axios from "axios";
import { headerTrampos } from "../../variables/axiosHeader";
import notifier from "node-notifier";

import * as fs from "fs/promises";
import { Opportunite } from "./types";
import { addOprotunityOnTramposTable } from "./db_operations";

// to use correctly you need to add a number afther the url
const API_URL =
  "https://trampos.co/api/v2/opportunities?ct[]=programacao&ct[]=ti&tp[]=emprego&page=";

const getJobsOnPage = async (page: string) => {
  const responseTrampos = await axios.get(API_URL + page, {
    headers: headerTrampos,
  });
  const tramposOpportunities: any[] = responseTrampos.data?.opportunities;
  const x = tramposOpportunities.map((opportunite: Opportunite) => {
    return {
      id: opportunite.id,
      name: opportunite.name,
      state: opportunite.state,
      city: opportunite.city,
      salary: opportunite.salary,
      hybrid: opportunite.hybrid,
      published_at: opportunite.published_at,
      home_office: opportunite.home_office,
      url: "https://trampos.co/oportunidades/" + opportunite.id,
    };
  });

  return x;
};

const mock: Opportunite[] = [
  {
    id: 759651,
    name: "Técnico(a) de Suporte",
    state: "GO",
    city: "Mineiros",
    salary: "R$ 1.500 a R$ 2.000",
    hybrid: false,
    published_at: "2024-06-14T09:40:05.000-03:00",
    home_office: undefined,
    url: "https://trampos.co/oportunidades/759651",
  },
  {
    id: 759849,
    name: "Programador(a) Front-end",
    state: "SP",
    city: "São Paulo",
    salary: "NÃO DIVULGADA",
    hybrid: false,
    published_at: "2024-06-12T23:43:02.000-03:00",
    home_office: undefined,
    url: "https://trampos.co/oportunidades/759849",
  },
  {
    id: 759734,
    name: "Developer",
    state: "SP",
    city: "São Paulo",
    salary: "NÃO DIVULGADA",
    hybrid: true,
    published_at: "2024-06-11T13:05:02.000-03:00",
    home_office: undefined,
    url: "https://trampos.co/oportunidades/759734",
  },
];

const saveJobsOnDB = async (jobs: Opportunite[]) => {
  jobs.forEach((job) => addOprotunityOnTramposTable(job));
};

export const searchTrampos = async () => {
  let jobs: Opportunite[] = [];
  const pagesToSearch = ["1", "2", "3", "4", "5", "6"];
  try {
    for (let i of pagesToSearch) {
      const tmp: Opportunite[] = await getJobsOnPage(i);
      jobs = [...jobs, ...tmp];
    }
    saveJobsOnDB(jobs);
  } catch (err) {
    notifier.notify(
      "Erros while searching jobs on Trampos, you can find more info on the logs",
    );
    await fs.appendFile("./error_log", `${new Date()} ==>> ${err}`);
  }

  // getJobsOnPage("1");
};
