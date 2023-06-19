import React from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  TextField,
  Container,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";

const Note = ({ type, title, symptoms, prescription, patientid }) => {
  const { id } = useParams();
  const token = useSelector((state) => state.global.token);
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(
      "A title or name for the disease/injury/illness is required"
    ),
    symptoms: Yup.string().required(" Symptoms or General notes are required"),
    prescription: Yup.string().required(
      "Prescription, recommendations or treatments are required"
    ),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const onSubmit = (data) => {
    if (type === "Create") {
      const url = `${process.env.REACT_APP_BASE_URL}/notes/${id}`;
      axios
        .post(
          url,
          {
            title: data["name"],
            disease_symptoms: data["symptoms"],
            prescription: data["prescription"],
          },
          {
            headers: {
              authorization: `${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.status === 201) {
            alert("Note successfully created");
            navigate(`/patient/${id}`);
            navigate(0);
          }
        })
        .catch((err) => {
          if (err.response.status === 403 || err.response.status === 404) {
            alert(err.response.data.detail);
          } else {
            alert("Please log out and log in!!");
          }
        });
    } else if (type === "Edit") {
      const url = `${process.env.REACT_APP_BASE_URL}/notes/${id}`;
      axios
        .put(
          url,
          {
            title: data["name"],
            disease_symptoms: data["symptoms"],
            prescription: data["prescription"],
          },
          {
            headers: {
              authorization: `${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            navigate(`/patient/${patientid}`);
            navigate(0);
          }
        })
        .catch((err) => {
          if (err.response.status === 404 || err.response.status === 403) {
            alert(err.response.data.detail);
          } else {
            alert("Please log out and log in!!");
          }
        });
    }
  };

  return (
    <>
      {(title || type === "Create") && (
        <Container component="main" maxWidth="30%" marginLeft="0px">
          <Box
            sx={{
              marginTop: "10px",
              marginLeft: "0px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "secondary.main",
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: "neutral.main", alignItems: "center" }}
            >
              <SpeakerNotesIcon sx={{ color: "#000000" }} />
            </Avatar>
            <Typography component="h1" variant="h5">
              {type} note
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    id="name"
                    label="Name of disease/injury/illness"
                    name="name"
                    defaultValue={title}
                    margin="dense"
                    {...register("name")}
                    error={errors.name ? true : false}
                  />
                  <Typography variant="inherit" color="textSecondary">
                    {errors.name?.message}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    id="symptoms"
                    label="Symptoms, Observations or General Notes"
                    name="symptoms"
                    defaultValue={symptoms}
                    margin="dense"
                    {...register("symptoms")}
                    error={errors.symptoms ? true : false}
                  />
                  <Typography variant="inherit" color="textSecondary">
                    {errors.symptoms?.message}
                  </Typography>
                </Grid>{" "}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    id="prescription"
                    label="Prescription, Advice or Recommendations for Patient"
                    name="prescription"
                    defaultValue={prescription}
                    margin="dense"
                    {...register("prescription")}
                    error={errors.prescription ? true : false}
                  />
                  <Typography variant="inherit" color="textSecondary">
                    {errors.prescription?.message}
                  </Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {type} Note
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
};

export default Note;
