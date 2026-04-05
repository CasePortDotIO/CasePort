import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "@/pages/Home";
import InsightsPage from "@/pages/InsightsPage";
import ArticlePage from "@/pages/ArticlePage";
import RequestAccess from "@/pages/RequestAccess";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/request-access" component={RequestAccess} />
      <Route path="/insights" component={InsightsPage} />
      <Route path="/insights/:slug" component={ArticlePage} />
      <Route path="/404" component={NotFound} />
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
