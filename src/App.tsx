import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate, Navigate } from "react-router-dom";
import Crypto from "./pages/Crypto";
import Stocks from "./pages/Stocks";
import RedirectingErrorBoundary from "./components/redirectingErrorBoundary/redirectingErrorBoundary";

const routes = [
  { element: <Stocks />, path: "/" },
  { element: <Stocks />, path: "/:symbol" },
  { element: <Crypto />, path: "/crypto/:symbol" },
  { element: <Crypto />, path: "/crypto" },
];

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidPath, setIsValidPath] = useState(true);

  useEffect(() => {
    const pathToRegex = (path: string) => new RegExp(`^${path.replace(/:\w+/g, "\\w+")}$`);
    const isPathValid = routes.some(route => pathToRegex(route.path).test(location.pathname));

    if (!isPathValid) {
      setIsValidPath(false);
      navigate("/");
    } else {
      setIsValidPath(true);
    }
  }, [location.pathname, navigate]);

  return (
    <RedirectingErrorBoundary>
      <Routes>
        {routes.map((route, i) => (
          <Route element={route.element} path={route.path} key={i} />
        ))}
        {!isValidPath && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </RedirectingErrorBoundary>
  );
};

export default App;
