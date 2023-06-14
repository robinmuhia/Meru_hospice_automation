import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Navbar from "components/Navbar";
import Login from "scenes/login";
import Dashboard from "scenes/dashboard";
import NewPatient from "scenes/create-patient";
import Patient from "scenes/patient";
import EditPatient from "scenes/edit-patient";
import NewNote from "scenes/create-note";
import EditNote from "scenes/edit-note";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Navbar />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/createpatient" element={<NewPatient />} />
              <Route path="/editpatient/:id" element={<EditPatient />} />
              <Route path="/patient/:id" element={<Patient />} />
              <Route path="/createnote/:id/:name" element={<NewNote />} />
              <Route
                path="/editnote/:id/:name/:patientid"
                element={<EditNote />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
