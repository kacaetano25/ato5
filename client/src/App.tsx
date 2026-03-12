import { Switch, Route, Router } from "wouter"; // Adicionei o 'Router' aqui
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Static Creative Coding Project Component
function CreativeCodingProject() {
  // AJUSTE 1: Agora ele sabe que o arquivo está dentro da pasta /ato5/
  window.location.href = '/ato5/index.html';
  return null;
}

function AppRouter() { // Mudei o nome para não confundir com o da biblioteca
  return (
    // AJUSTE 2: Avisamos ao roteador que o endereço base é /ato5
    <Router base="/ato5">
      <Switch>
        <Route path="/" component={CreativeCodingProject} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
