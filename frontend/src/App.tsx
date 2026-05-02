import { BrowserRouter, Route, Routes } from "react-router";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
