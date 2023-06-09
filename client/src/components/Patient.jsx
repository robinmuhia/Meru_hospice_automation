import React from "react";
import {
  Avatar,
  Button,
  TextField,
  Container,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { ChildCareOutlined } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";

const PatientForm = ({ type, name, ageyears, agemonths, phonenumber, id }) => {
  const userId = useSelector((state) => state.global.user.id);
  const token = useSelector((state) => state.global.token);
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("A name for the patient is required"),
    phonenumber: Yup.number(
      "The phone number is invalid! Please write it for example 078345678"
    ).required("Phone number of the patient is required"),
    ageyears: Yup.number("Age is invalid! Please write a number")
      .required("Age of patient is required")
      .min(0)
      .max(104),
    agemonths: Yup.number("Age is invalid! Please write a number")
      .required("Age of patient is required")
      .min(0)
      .max(11),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const onSubmit = (data) => {
    const age = data["ageyears"] * 12 + data["agemonths"];
    if (type === "Create") {
      const url = `${process.env.REACT_APP_BASE_URL}/patient/${userId}`;
      axios
        .post(
          url,
          {
            name: data["name"],
            lower_name: data["name"].replaceAll(/\s/g, "").toLowerCase(),
            age: age,
            phone_number: data["phonenumber"],
            num_images: 0,
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
            alert("Patient successfully created");
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          if (err.response.status === 409) {
            alert(err.response.data.detail);
          } else {
            alert("Please log out and log in!!");
          }
        });
    } else if (type === "Edit") {
      const url = `${process.env.REACT_APP_BASE_URL}/patient/${id}`;
      axios
        .put(
          url,
          {
            name: data["name"],
            lower_name: data["name"].replaceAll(/\s/g, "").toLowerCase(),
            age: age,
            phone_number: data["phonenumber"],
            num_images: 0,
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
            navigate(`/patient/${id}`);
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
      {(name || type === "Create") && (
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
              <ChildCareOutlined sx={{ color: "#000000" }} />
            </Avatar>
            <Typography component="h1" variant="h5">
              {type} patient
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name of patient"
                    name="name"
                    defaultValue={name}
                    margin="dense"
                    {...register("name")}
                    error={errors.name ? true : false}
                  />
                  <Typography variant="inherit" color="textSecondary">
                    {errors.name?.message}
                  </Typography>
                </Grid>
                <Grid item xs={8} display="flex" flexDirection="row">
                  <TextField
                    required
                    fullWidth
                    id="ageyears"
                    label="Age of patient in years"
                    name="ageyears"
                    margin="dense"
                    defaultValue={ageyears}
                    {...register("ageyears")}
                    error={errors.ageyears ? true : false}
                  />
                  <Typography
                    variant="inherit"
                    color="#000000"
                    sx={{ margin: "20px" }}
                  >
                    years
                  </Typography>
                  <Typography variant="inherit" color="textSecondary">
                    {errors.ageyears?.message}
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    id="agemonths"
                    label="Age of patient in months"
                    name="agemonths"
                    margin="dense"
                    defaultValue={agemonths}
                    {...register("agemonths")}
                    error={errors.agemonths ? true : false}
                  />
                  <Typography
                    variant="inherit"
                    color="#000000"
                    sx={{ margin: "20px" }}
                  >
                    months
                  </Typography>
                  <Typography variant="inherit" color="textSecondary">
                    {errors.agemonths?.message}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    required
                    fullWidth
                    id="phonenumber"
                    label="Phone number of patient"
                    name="phonenumber"
                    defaultValue={type === "Edit" ? `0${phonenumber}` : ""}
                    margin="dense"
                    {...register("phonenumber")}
                    error={errors.phonenumber ? true : false}
                  />
                  <Typography variant="inherit" color="textSecondary">
                    {errors.phonenumber?.message}
                  </Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {type} patient
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
};

export default PatientForm;
