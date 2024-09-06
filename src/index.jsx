import { render } from "preact";
import "./globals.css";
import { AppQueryClientProvider } from "./lib/react-query";
import { DirectionProvider } from "@radix-ui/react-direction";
import { Toaster } from "./components/ui/toaster";
import { ErrorBoundary, lazy, LocationProvider, Router } from "preact-iso";
import { UserContextProvider } from "./context/user/user.context";

const LoginPage = lazy(() => import("./pages/login/login.page"));
const AuthPage = lazy(() => import("./pages/auth/auth.page"));
const AdminPage = lazy(() => import("./pages/admin/admin.page"));
const ProviderPage = lazy(() => import("./pages/provider/provider.page"));
const NotFoundPage = lazy(() => import("./pages/not-found/not-found.page"));

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <AppQueryClientProvider>
          <DirectionProvider dir="rtl">
            <UserContextProvider>
              <div className="p-4 mx-auto h-[100dvh] dark">
                <Router>
                  <LoginPage path="/" />
                  <AuthPage path="/auth" />
                  <AdminPage path="/admin" />
                  <ProviderPage path="/provider" />
                  <NotFoundPage default />
                </Router>
              </div>
            </UserContextProvider>
            <Toaster />
          </DirectionProvider>
        </AppQueryClientProvider>
      </ErrorBoundary>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
