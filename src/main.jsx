import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from './context/themecontext';
import { createRoot } from 'react-dom/client'
import App from "./App";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </ThemeProvider>

);
