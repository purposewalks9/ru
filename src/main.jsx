import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./component/ScrollToTop";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
