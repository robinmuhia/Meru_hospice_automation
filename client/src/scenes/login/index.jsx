import React from "react";
import {
  Container,
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setLogin, setLogout } from "state";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useGetLoginQuery } from "state/api";
import { useTheme } from "@emotion/react";

const Login = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.global.user.id);
  const { data, isLoading } = useGetLoginQuery(userId);
  const theme = useTheme();

  if (!isLoading) {
    if (data && data.message === "authenticated") {
      navigate("/dashboard");
    } else {
      //pass
    }
  }

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("username", data["email"]);
    formData.append("password", data["password"]);
    axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/login`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        if (res.status === 200) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) {
            dispatch(setLogout());
          }
          localStorage.setItem("user", JSON.stringify(res.data));
          dispatch(
            setLogin({
              user: res.data.user,
              token: `${res.data.token_type} ${res.data.access_token}`,
            })
          );
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        if (err.response.status === 403) {
          alert("Invalid credentials");
        } else {
          alert("Please try again later!!");
        }
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: theme.palette.neutral.main }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" color="secondary">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "340px" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            InputLabelProps={{
              style: { color: "#ffffff" },
            }}
            {...register("email")}
            error={errors.email ? true : false}
          />
          <Typography variant="inherit" color="secondary">
            {errors.email?.message}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoFocus
            InputLabelProps={{
              style: { color: "#ffffff" },
            }}
            autoComplete="current-password"
            {...register("password")}
            error={errors.password ? true : false}
          />
          <Typography variant="inherit" color="secondary">
            {errors.password?.message}
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: theme.palette.main }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
