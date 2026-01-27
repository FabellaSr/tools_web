
import homeCards from "./jsonCards.json";

const HOME_CARDS = homeCards.map((c) => ({
  icon: c.icon,
  title: c.title,
  description: c.description,
  path: c.path,
}));

export default HOME_CARDS;
