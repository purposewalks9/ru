import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./component/ScrollToTop";
import { createRoot } from 'react-dom/client'
import App from "./App";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
