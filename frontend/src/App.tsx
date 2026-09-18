import { useHashRoute } from "./lib/router";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LandingPage } from "./pages/LandingPage";
import { LinkAccountPage } from "./pages/LinkAccountPage";
import { PlanPage } from "./pages/PlanPage";
import { ReportPage } from "./pages/ReportPage";
import { StyleGuidePage } from "./pages/StyleGuidePage";

export default function App() {
  const route = useHashRoute();

  switch (route) {
    case "/login": return <AuthPage mode="login" />;
    case "/registro": return <AuthPage mode="register" />;
    case "/recuperar": return <AuthPage mode="recover" />;
    case "/vincular": return <LinkAccountPage />;
    case "/dashboard": return <DashboardPage />;
    case "/evaluacion/nueva": return <EvaluationPage />;
    case "/evaluacion/4": return <ReportPage />;
    case "/plan": return <PlanPage />;
    case "/historial": return <HistoryPage />;
    case "/guia-visual": return <StyleGuidePage />;
    case "/": return <LandingPage />;
  }
}
