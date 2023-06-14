import React from "react";
import Note from "components/Note";
import Header from "components/Header";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

const NewNote = () => {
  const { name } = useParams();
  const value = "Create";
  const subheader = `Add new note for ${name}`;
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="New Note" subtitle={subheader} />
      <Note type={value} />
    </Box>
  );
};

export default NewNote;
