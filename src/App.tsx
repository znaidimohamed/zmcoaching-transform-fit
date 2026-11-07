import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import ProtectedRoute from "./pages/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardOverviewPage from "./pages/Dashboard/DashboardOverviewPage";
import UsersPage from "./pages/Dashboard/UsersPage";
import TransformationsPage from "./pages/Dashboard/TransformationsPage";
import PacksPage from "./pages/Dashboard/PacksPage";
import NutritionPlansPage from "./pages/Dashboard/NutritionPlansPage";
import TrainingProgramsPage from "./pages/Dashboard/TrainingProgramsPage";
import ProgressPage from "./pages/Dashboard/ProgressPage";
import CoursesPage from "./pages/Dashboard/CoursesPage";
import LeadsPage from "./pages/Dashboard/LeadsPage";
import PurchaseRequestsPage from "./pages/Dashboard/PurchaseRequestsPage";
import SchedulePage from "./pages/Dashboard/SchedulePage";
import CheckInsPage from "./pages/Dashboard/CheckInsPage";
import ChatPage from "./pages/Dashboard/ChatPage";

import UserLayout from "./pages/User/UserLayout";
import MyNutritionPage from "./pages/User/MyNutritionPage";
import MyTrainingPage from "./pages/User/MyTrainingPage";
import MyProgressPage from "./pages/User/MyProgressPage";
import MySchedulePage from "./pages/User/MySchedulePage";
import MyCheckInsPage from "./pages/User/MyCheckInsPage";
import MyChatPage from "./pages/User/MyChatPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverviewPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="transformations" element={<TransformationsPage />} />
              <Route path="packs" element={<PacksPage />} />
              <Route path="nutrition" element={<NutritionPlansPage />} />
              <Route path="training" element={<TrainingProgramsPage />} />
              <Route path="checkins" element={<CheckInsPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route
                path="purchase-requests"
                element={<PurchaseRequestsPage />}
              />
              <Route path="leads" element={<LeadsPage />} />
            </Route>

            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MyNutritionPage />} />
              <Route path="nutrition" element={<MyNutritionPage />} />
              <Route path="training" element={<MyTrainingPage />} />
              <Route path="schedule" element={<MySchedulePage />} />
              <Route path="checkins" element={<MyCheckInsPage />} />
              <Route path="progress" element={<MyProgressPage />} />
              <Route path="chat" element={<MyChatPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;