import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import PageNotFound from "./pages/404";
import LoginPage from "./pages/LoginPage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ui/ProtectedRoute";
import Layout from "./layout/Layout";
import AdminPage from "./pages/AdminPage";
import ScholarshipPage from "./pages/ScholarshipPage";
import AddScholarship from "./pages/AddScholarship";
import LanguagePage from "./pages/LanguagePage";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scholarship"
              element={
                <ProtectedRoute>
                  <ScholarshipPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-scholarship"
              element={
                <ProtectedRoute>
                  <AddScholarship />
                </ProtectedRoute>
              }
            />
              <Route
              path="/language"
              element={
                <ProtectedRoute>
                  <LanguagePage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route index element={<Navigate replace to="login" />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
