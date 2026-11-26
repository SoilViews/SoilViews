import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import RequireAuth from "./components/layout/RequireAuth";
import { Role } from "./constants/roles";
// Route pages are lazy-loaded so the map/wizard code and ekate data stay out of the main chunk.
const IndexPage = lazy(() => import("./components/index/indexPage"));
const SignIn = lazy(() => import("./components/auth/SignIn"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const SignUp = lazy(() => import("./components/auth/SignUp"));
const CreateProject = lazy(() => import("./components/projects/CreateProject"));
const Profile = lazy(() => import("./components/Profile/profile"));
const ContactForm = lazy(() => import("./components/ContactForm/ContactForm"));
const Documentation = lazy(() => import("./components/Help/HelpPage"));
const AdminPanel = lazy(() => import("./components/Admin/AdminPanel"));
const EditUser = lazy(() => import("./components/Admin/EditUser"));
const EditOrder = lazy(() => import("./components/MyOrders/EditOrder"));
const MyOrders = lazy(() => import("./components/MyOrders/MyOrders"));
const AboutUs = lazy(() => import("./components/About/AboutUs"));
const HorizontalLinearStepper = lazy(() => import("./components/Wizard/HorizontalLinearStepper"));
const Acknowledgements = lazy(() => import("./components/Acknowledgements/Acknowledgements"));
const Pricing = lazy(() => import("./components/Pricing/Pricing"));

export const AppRoutes = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<IndexPage />} />
      <Route path="/indexPage" element={<IndexPage />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />
      <Route path="/CreateProject" element={<CreateProject />} />
      <Route path="/ContactForm" element={<ContactForm />} />
      <Route path="/HelpPage" element={<Documentation />} />
      <Route path="/About" element={<AboutUs />} />
      <Route path="/Acknowledgements" element={<Acknowledgements />} />
      <Route path="/Pricing" element={<Pricing />} />

      <Route element={<RequireAuth />}>
        <Route path="/Dashboard" element={<HorizontalLinearStepper />} />
        <Route path="/NewOrder" element={<HorizontalLinearStepper />} />
        <Route path="/MyOrders" element={<MyOrders />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/edit/:id" element={<EditUser />} />
        <Route path="/editOrder/:id" element={<EditOrder />} />
      </Route>
      <Route element={<RequireAuth roles={[Role.Admin]} />}>
        <Route path="/AdminPanel" element={<AdminPanel />} />
      </Route>

      <Route path="*" element={<IndexPage />} />
    </Route>
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
