// Import libs
import { useContext } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";

// Import widgets
import Footer from "./components/widgets/Footer";
import Header from "./components/widgets/Header";

// Import layouts
import Index from "./components/layouts/Index";
import Home from "./components/layouts/Home";
import Info from "./components/layouts/Info";
import Detail from "./components/layouts/Detail";
import NotFound from "./components/layouts/NotFound";

// Import context
import { LicenseContext } from "./context/LicenseContext";

function App() {
  const { currentAccount } = useContext(LicenseContext);

  console.log(currentAccount ? "True" : "False");

  return (
    <Router>
      <Header />

      <div className="container">
        <Routes>
          <Route
            path="/"
            exact
            element={
              currentAccount ? (
                <Navigate to={{ pathname: "/home" }} />
              ) : (
                <Index />
              )
            }
          />

          <Route path="/index" element={<Navigate to={{ pathname: "/" }} />} />

          <Route
            path="/home"
            element={
              currentAccount ? <Home /> : <Navigate to={{ pathname: "/" }} />
            }
          />

          <Route path="/info" element={<Info />} />

          <Route path="/detail/:imageId" element={<Detail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
