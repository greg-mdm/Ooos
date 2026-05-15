import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav, Footer, SkipLink } from "./components/Layout";
import { Home } from "./components/Home";
import { Ostara } from "./components/Ostara";
import { Exhibition } from "./components/Exhibition";
import { CID } from "./components/CID";
import { About } from "./components/About";
import { SupportModal } from "./components/SupportModal";
import OooDashBoardForNewUser from "@/imports/🥘OooDashBoardForNewUser/🥘OooDashBoardForNewUser";

export default function App() {
  const [supportOpen, setSupportOpen] = useState(false);
  const open = () => setSupportOpen(true);
  const close = () => setSupportOpen(false);

  return (
    <BrowserRouter>
      <SkipLink />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home onSupport={open} />} />
          <Route path="/ostara" element={<Ostara onSupport={open} />} />
          <Route path="/cid" element={<CID onSupport={open} />} />
          <Route path="/exhibition" element={<Exhibition onSupport={open} />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/legacy"
            element={
              <div style={{ overflow: "auto", background: "#f0f4f5" }}>
                <div style={{ position: "relative", width: 1440, height: 2450, margin: "0 auto" }}>
                  <OooDashBoardForNewUser />
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      {supportOpen && <SupportModal onClose={close} />}
    </BrowserRouter>
  );
}
