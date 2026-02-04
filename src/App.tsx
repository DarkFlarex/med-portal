import {Route, Routes } from "react-router-dom";
import Layout from "./UI/Layout/Layout.tsx";
import {Typography} from "@mui/material";
import MainPage from "./features/main/MainPage.tsx";
import PageDirections from "./features/directions/PageDirections.tsx";
import PageAppointments from "./features/appointments/PageAppointments.tsx";
import PageRecords from "./features/records/PageRecords.tsx";
import PageDoctors from "./features/doctors/PageDoctors";
import Login from "./features/users/login.tsx";

const App = () => {

  return (
      <Layout>
          <Routes>
              <Route path={"/"} element={
                      <MainPage/>
              }/>
              <Route path="/directions" element={<PageDirections />} />
              <Route path={"/doctors"} element={<PageDoctors/>}/>
              <Route path={"/appointments"} element={<PageAppointments/>}/>
              <Route path={"/records"} element={<PageRecords/>}/>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Typography variant="h1">Not found</Typography>}/>
          </Routes>
      </Layout>
  )
}

export default App
