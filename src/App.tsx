import { Route, Routes } from "react-router-dom";
import Layout from "./UI/Layout/Layout.tsx";
import { Typography } from "@mui/material";
import PageRecords from "./features/records/PageRecords.tsx";
import Login from "./features/users/login.tsx";
import Blacklist from "./features/blacklist.tsx";
import PageBooking from "./features/Pagebooking.tsx";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path={"/"} element={<PageBooking />} />
        <Route path="/services" element={<PageBooking />} />
        {/* <Route path="/directions" element={<PageDirections />} />
        <Route path={"/doctors"} element={<PageDoctors />} />
        <Route path={"/appointments"} element={<PageAppointments />} />*/}
        <Route path={"/records"} element={<PageRecords />} />
        <Route path="/login" element={<Login />} />
        <Route path="/black-list" element={<Blacklist />} />
        <Route
          path="*"
          element={<Typography variant="h1">Not found</Typography>}
        />
      </Routes>
    </Layout>
  );
};

export default App;
