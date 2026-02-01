import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Services,
  Logs,
  Install,
  Installs,
  InstallDetail,
  Login,
  Audit,
  RequireAuth,
  Layout,
  UsersAdminPage
} from "./pages";


export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin/users" element={<RequireAuth><UsersAdminPage /></RequireAuth>} />
          <Route path="/install" element={<RequireAuth><Install /></RequireAuth>} />
          <Route path="/services" element={<RequireAuth><Services /></RequireAuth>} />
          <Route path="/logs" element={<RequireAuth><Logs /></RequireAuth>} />
          <Route path="/logs/:tipo/:nro" element={<RequireAuth><Logs /></RequireAuth>} />
          <Route path="/installs" element={<RequireAuth> <Installs /></RequireAuth>}/>
          <Route path="/installs/:tipo/:nro" element={<RequireAuth><InstallDetail /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="audit" element={<RequireAuth><Audit /></RequireAuth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
