import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./input.css";
import { Middleware } from "./Middleware.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Middleware>
        <App />
      </Middleware>
    </QueryClientProvider>
  </BrowserRouter>
);
