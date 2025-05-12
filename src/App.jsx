import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import { Toaster } from "./components/ui/toaster"
import HomePage from "./pages/home"
import DashboardPage from "./pages/dashboard"
import EventsPage from "./pages/events"
import EventDetailPage from "./pages/event-detail"
import CreateEventPage from "./pages/create-event"
import RegisterPage from "./pages/register"
import LoginPage from "./pages/login"
import AdminDashboardPage from "./pages/admin-dashboard"
import ProtectedRoute from "./components/protected-route"
import OrganizerRoute from "./components/organizer-route"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route
              path="/events/create"
              element={
                <OrganizerRoute>
                  <CreateEventPage />
                </OrganizerRoute>
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <OrganizerRoute>
                  <AdminDashboardPage />
                </OrganizerRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App
