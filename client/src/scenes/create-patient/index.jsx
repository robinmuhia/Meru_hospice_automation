import React from "react";
import Header from "components/Header";
import { Box } from "@mui/material";
import Patient from "components/Patient";

const NewPatient = () => {
  const value = "Create";
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="New Patient" subtitle="Add new patients into the system" />
      <Patient type={value} />
    </Box>
  );
};

export default NewPatient;
