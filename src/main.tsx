import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { App } from "./App";
import { HomePage } from "./pages/HomePage";
import { AppPage } from "./pages/AppPage";
import { FeedPage } from "./pages/FeedPage";
import { SingleColumnFeedPage } from "./pages/SingleColumnFeedPage";
import { InboxPage } from "./pages/InboxPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MvpPage } from "./pages/MvpPage";
import { AnimationPage } from "./pages/AnimationPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { FlipCardPage } from "./pages/FlipCardPage";
import { LikePage } from "./pages/LikePage";
import { SplashPage } from "./pages/SplashPage";
import { InspirationPage } from "./pages/InspirationPage";
import { AnimationInspirationPage } from "./pages/AnimationInspirationPage";
import { ThemeProvider } from "./hooks/useTheme";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}>
      <ThemeProvider>
      <Routes>
        <Route element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="app" element={<AppPage />}>
            <Route path="mvp/inbox" element={<InboxPage />} />
            <Route path="mvp/profile" element={<ProfilePage />} />
            <Route path="mvp" element={<MvpPage />} />
            <Route index element={<FeedPage />} />
            <Route path="card" element={<SingleColumnFeedPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="animation" element={<AnimationPage />} />
          <Route path="animation/onboarding" element={<OnboardingPage />} />
          <Route path="animation/flip-card" element={<FlipCardPage />} />
          <Route path="animation/like" element={<LikePage />} />
          <Route path="animation/splash" element={<SplashPage />} />
          <Route path="animation/opening" element={<Navigate to="/animation/splash" replace />} />
          <Route path="inspiration" element={<InspirationPage />} />
          <Route path="inspiration/animations" element={<AnimationInspirationPage />} />
        </Route>
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
