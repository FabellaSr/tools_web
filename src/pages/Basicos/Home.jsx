import { useNavigate } from "react-router-dom";
import { CardN1 , TitlePage, OrderCards } from "../../components/ui";
import HOME_CARDS from "../../data/cardsHome/data";

const title = "🏠 Home ";
const subtitle = "AS400 Tools Web — accesos rápidos para tareas de instalación y pruebas de APIs.";

export default function Home() {
  const navigate = useNavigate();

  return ( 
      <TitlePage title={title} 
                 subtitle={subtitle} 
                 banner={{
                 background: "linear-gradient(135deg, #0f172a, #020617)", }}>
          <OrderCards>
            {HOME_CARDS.map((card) => (
              <CardN1
                key={card.path}
                icon={card.icon}
                title={card.title}
                description={card.description}
                actionLabel="Ir"
                onAction={() => navigate(card.path)}
              />
            ))}
          </OrderCards>
      </TitlePage>
    );
}