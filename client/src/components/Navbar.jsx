import React from "react";
import { useDispatch } from "react-redux";
import { AppBar, Box, Typography, Toolbar, Link, Button } from "@mui/material";
import { setLogout } from "state";
import { useNavigate, Outlet } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "block",
      }}
    >
      <AppBar position="relative" color="primary">
        <Toolbar variant="dense">
          <Link href="/dashboard">
            <Typography
              variant="h2"
              color="secondary"
              component="div"
              fontWeight="bold"
              marginLeft="40px"
            >
              DR. GATINU B.W.
            </Typography>
          </Link>
          <Typography
            variant="h4"
            color="secondary"
            component="div"
            marginLeft="60px"
          >
            Custom Automated System
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Link href="/dashboard">
              <Typography
                variant="h6"
                color="secondary"
                component="div"
                fontWeight="bold"
              >
                View All Patients
              </Typography>
            </Link>
            <Link href="/createpatient">
              <Typography
                variant="h6"
                color="secondary"
                component="div"
                fontWeight="bold"
              >
                Add New Patient
              </Typography>
            </Link>
            <Button onClick={handleLogout}>
              {" "}
              <Typography
                variant="h6"
                color="secondary"
                component="div"
                fontWeight="bold"
              >
                Log Out
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
};

export default Navbar;
