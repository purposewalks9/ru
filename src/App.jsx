import { Routes, Route } from "react-router-dom";
import MainLayout from "./mainlayout";

import Home from "./pages/home";
import About from "./pages/about";
import Career from "./pages/career";
import Stories from "./pages/stories";
import TeamSection from "./pages/team";
import PressAwards from "./pages/press";
import Admin from "./pages/admin";
import ProtectedRoute from "./context/protected";
import SignIn from "./pages/signin";

function App() {
  return (
    <div className="overflow-hidden">
      <Routes>

        {/* Public pages WITH navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/career" element={<Career />} />
          <Route path="/team" element={<TeamSection />} />
          <Route path="/press" element={<PressAwards />} />
          <Route path="/login" element={<SignIn />} />
        </Route>

        {/* Admin page WITHOUT navbar */}
             <Route 
              path="/admin" 
              element={<ProtectedRoute><Admin /></ProtectedRoute>} 
            />

      </Routes>
    </div>
  );
}

export default App;
