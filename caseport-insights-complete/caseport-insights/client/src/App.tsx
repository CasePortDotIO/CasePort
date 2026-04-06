import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import InsightsPage from "./pages/InsightsPage";
import ArticlePage from "./pages/ArticlePage";
import Markets from "./pages/Markets";
import MarketState from "./pages/MarketState";
import MarketCity from "./pages/MarketCity";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={InsightsPage} />
      <Route path={"/insights"} component={InsightsPage} />
      <Route path={"/insights/:slug"} component={ArticlePage} />
      <Route path={"/markets"} component={Markets} />
      <Route path={"/markets/:slug"} component={(props) => {
        const { slug } = props.params;
        if (['maryland', 'texas', 'florida'].includes(slug)) {
          return <MarketState slug={slug} />;
        } else if (['baltimore', 'houston'].includes(slug)) {
          return <MarketCity slug={slug} />;
        }
        return <NotFound />;
      }} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
