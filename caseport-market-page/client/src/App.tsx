import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import MarketPage from "./pages/MarketPage";
import CityMarketPage from "./pages/CityMarketPage";
import Sitemap from "./pages/Sitemap";

function Router() {
  return (
    <Switch>
      <Route path={"/?"} component={MarketPage} />
      <Route path={"/markets"} component={MarketPage} />
      <Route path={"/markets/:city"} component={CityMarketPage} />
      <Route path={"/sitemap.xml"} component={Sitemap} />
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
