import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; 

import {
  Home,
  Services,
  Logs,
  Install,
  Installs,
  MiCvPage,
  InstallDetail,
  Login,
  Audit,
  RequireAuth
} from "./pages";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/install" element={<RequireAuth><Install /></RequireAuth>} />
          <Route path="/services" element={<RequireAuth><Services /></RequireAuth>} />
          <Route path="/logs" element={<RequireAuth><Logs /></RequireAuth>} />
          <Route path="/logs/:tipo/:nro" element={<RequireAuth><Logs /></RequireAuth>} />
          <Route path="/installs" element={<RequireAuth> <Installs /></RequireAuth>}/>
          <Route path="/MiCv" element={<MiCvPage />} />
          <Route path="/installs/:tipo/:nro" element={<RequireAuth><InstallDetail /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="audit" element={<RequireAuth><Audit /></RequireAuth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
