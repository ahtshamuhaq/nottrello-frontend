import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import AdminPage from "./Pages/AdminPage";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <AuthProvider>
          <div>
            <Routes>
              <Route path="/" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
            <ToastContainer />
          </div>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
