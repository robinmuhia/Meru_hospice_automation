import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import Note from "components/Note";
import Header from "components/Header";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditNote = () => {
  const { id, name, patientid } = useParams();
  const token = useSelector((state) => state.global.token);
  const value = "Edit";
  const subheader = `Edit note for ${name}`;
  const [title, setTitle] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [prescription, setPrescription] = useState("");

  useLayoutEffect(() => {
    const url = `${process.env.REACT_APP_BASE_URL}/notes/specific/${id}`;
    axios
      .get(url, {
        headers: {
          authorization: `${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setTitle(res.data.title);
        setSymptoms(res.data.disease_symptoms);
        setPrescription(res.data.prescription);
      })
      .catch((err) => {
        if (err.response.status === 409) {
          alert(err.response.data.detail);
        } else {
          alert("Please log out and log in!!");
        }
      });
  }, [token, id]);
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Edit existing note" subtitle={subheader} />
      <Note
        type={value}
        title={title}
        symptoms={symptoms}
        prescription={prescription}
        patientid={patientid}
      />
    </Box>
  );
};

export default EditNote;
