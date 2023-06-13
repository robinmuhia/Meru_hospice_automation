import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetNotesQuery } from "state/api";
import Header from "components/Header";
import axios from "axios";
import { useSelector } from "react-redux";

const Notes = () => {
  const token = useSelector((state) => state.global.token);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetNotesQuery(id);
  let header;
  let years;
  let months;
  let patientId;
  if (data) {
    header = `Data for ${data.owner.name}`;
    years = Math.floor(data.owner.age / 12);
    months = Math.floor(data.owner.age % 12);
    patientId = data.owner.id;
  }
  const handleDelete = () => {
    const hasConfirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (hasConfirmed) {
      const url = `${process.env.REACT_APP_BASE_URL}/patient/${patientId}`;
      axios
        .delete(url, {
          headers: {
            authorization: `${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.status === 204) {
            navigate("/dashboard");
            navigate(0);
          }
        })
        .catch((err) => {
          if (err.response.status === 404 || err.response.status === 403) {
            alert(err.response.data.detail);
          } else {
            console.log(err);
            alert("Please log out and log in!!");
          }
        });
    }
  };

  return (
    <>
      {data && (
        <Box margin="10px">
          <Header title={header} subtitle="Interact with data for patient" />
          <Box
            sx={{
              marginTop: "10px",
              bgcolor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              width: "50vw",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" marginTop="10px">
              Name: {data.owner.name}
            </Typography>
            <Typography component="h1" variant="h5" marginTop="10px">
              Age: {years} years {months} months
            </Typography>
            <Typography component="h1" variant="h5" marginTop="10px">
              Phone number: 0{data.owner.phone_number}
            </Typography>
            <Box>
              <Button onClick={() => navigate(`/editpatient/${data.owner.id}`)}>
                Edit
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Notes;
