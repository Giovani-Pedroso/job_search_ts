import axios from "axios";
import * as fs from "fs/promises";
import notifier from "node-notifier";
import { headerInfojobs } from "../../variables/axiosHeader";
import parser, { HTMLElement as HE } from "node-html-parser";

const PAGES_TO_SEARCH = [
  "https://www.infojobs.com.br/vagas-de-emprego-react-em-sao-paulo,-sp.aspx?Antiguedad=3",
];

type Job = {
  name: string;
  url: string;
  publishedAt: string;
  city: string;
  state: string;
  type: string;
  id: string;
};

const getJobCardInfo = (card: HE): Job => {
  const name = card
    .querySelector("h2.h3.font-weight-bold.text-body.mb-8")
    ?.innerText.replace(/^\s*/, "")
    .trimEnd() as string;
  const url = ("https://www.infojobs.com.br" +
    card.querySelector("a")?.getAttribute("href")) as string;
  const type = card
    .querySelector("div.text-medium.caption")
    ?.innerText.trim()
    .replace("&#xED;", "í") as string;

  const year = new Date().getFullYear();
  const localAndDate = card.querySelectorAll("div.text-medium.small");

  // remove the text "0 Km de você" 0 Kilometers from you in protugues
  const local = localAndDate[0].innerText
    .replace("&#xE3;", "ã")
    .trim()
    .split(",")[0];
  const publishedAt = localAndDate[1].innerText.trim() + " " + year;
  const [city, state] = local.split("-") as [string, string];
  // console.log("title:", name);
  // console.log("url:", url);
  // console.log("type:", type);
  // console.log("date:", publishedAt);
  // console.log("city:", city.trim());
  // console.log("state:", state.trim());

  // It must be the url the id always chage
  // const id: any = url.match(/__[a-zA-Z0-9]*./);
  // console.log(id[0]?.slice(2, -1));

  return {
    name,
    city,
    state,
    url,
    publishedAt,
    type,
    id: url,
  };
};

export const searchInfojobs = async () => {
  try {
    const responsesInfojobs = await axios.get(PAGES_TO_SEARCH[0], {
      headers: headerInfojobs,
    });
    const htmlPage = parser.parse(responsesInfojobs.data);

    const jobsCards = htmlPage.querySelectorAll(
      ".py-16.pl-24.pr-16.cursor-pointer.js_vacancyLoad.js_cardLink",
    );
    const jobsInfo = jobsCards.map((jobCard) => getJobCardInfo(jobCard));
    console.log(jobsInfo);
  } catch (err) {
    notifier.notify(
      "Erros while searching jobs on Trampos, you can find more info on the logs",
    );
    await fs.appendFile("./error_log", `${new Date()} ==>> ${err}`);
  }
};
