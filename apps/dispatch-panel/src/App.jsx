import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import  Sidebar  from "./components/Sidebar";
import  Dashboard  from "./pages/Dashboard";
import  JobManagement  from "./pages/JobManagement";
import  UserManagement  from "./pages/UserManagement";
import Payments from "./pages/Payouts";
import Payouts from "./pages/Payouts";
import Reports  from "./pages/Reports";
import Success from "./Success";
import Cancel from "./Cancel";
import {Login} from "./pages/Login";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";
import Footer from './components/footer';
// import { ThemeProvider } from './components/theme-provider';
import "./index.css";


function App() {
  return (
    
    <Router>
      <div className="flex ">
        <Sidebar />
        <div className="flex-1 p-4 overflow-auto ">
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        > */}
        <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<JobManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/success" element={<Success />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
            
          </Routes>
          {/* </ThemeProvider> */}
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
