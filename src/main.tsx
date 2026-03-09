import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { App } from "./App";
import { HomePage } from "./pages/HomePage";
import { AppPage } from "./pages/AppPage";
import { FeedPage } from "./pages/FeedPage";
import { SingleColumnFeedPage } from "./pages/SingleColumnFeedPage";
import { InboxPage } from "./pages/InboxPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AnimationPage } from "./pages/AnimationPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { InspirationPage } from "./pages/InspirationPage";
import { AnimationInspirationPage } from "./pages/AnimationInspirationPage";
import { ThemeInspirationPage } from "./pages/ThemeInspirationPage";
import { AvatarInspirationPage } from "./pages/AvatarInspirationPage";
import { ThemeProvider } from "./hooks/useTheme";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/TinsleyToolbox">
      <ThemeProvider>
      <Routes>
        <Route element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="app" element={<AppPage />}>
            <Route index element={<FeedPage />} />
            <Route path="card" element={<SingleColumnFeedPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="animation" element={<AnimationPage />} />
          <Route path="animation/onboarding" element={<OnboardingPage />} />
          <Route path="inspiration" element={<InspirationPage />} />
          <Route path="inspiration/animations" element={<AnimationInspirationPage />} />
          <Route path="inspiration/themes" element={<ThemeInspirationPage />} />
          <Route path="inspiration/avatars" element={<AvatarInspirationPage />} />
          <Route path="inspiration/avatars" element={<AvatarInspirationPage />} />
          <Route path="inspiration/avatars" element={<AvatarInspirationPage />} />
        </Route>
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
