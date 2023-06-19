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
  if (data) {
    header = `Data for ${data.owner.name}`;
    years = Math.floor(data.owner.age / 12);
    months = Math.floor(data.owner.age % 12);
  }
  const handleDelete = (type, id) => {
    let url;
    if (type === "patient") {
      url = `${process.env.REACT_APP_BASE_URL}/patient/${id}`;
    } else if (type === "note") {
      url = `${process.env.REACT_APP_BASE_URL}/notes/${id}`;
    }
    const hasConfirmed = window.confirm(
      `Are you sure you want to delete this ${type}?`
    );
    if (hasConfirmed) {
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
        <Box
          m="1.5rem 2.5rem"
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Header
            title={header}
            subtitle="Interact with data for the patient"
          />
          <Box
            sx={{
              marginTop: "10px",
              borderBottom: "10px",
              bgcolor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              width: "50vw",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  component="h1"
                  variant="h5"
                  marginTop="10px"
                  marginLeft="15px"
                  fontWeight="bold"
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  NAME
                </Typography>
                <Typography
                  component="h1"
                  variant="h5"
                  marginTop="10px"
                  marginLeft="15px"
                >
                  {data.owner.name}
                </Typography>
                <Typography
                  component="h1"
                  variant="h5"
                  marginTop="10px"
                  marginLeft="15px"
                  fontWeight="bold"
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  AGE
                </Typography>
                <Typography
                  component="h1"
                  variant="h5"
                  marginTop="10px"
                  marginLeft="15px"
                >
                  {years} years {months} months
                </Typography>
                <Typography
                  component="h1"
                  variant="h5"
                  marginTop="10px"
                  marginLeft="15px"
                  fontWeight="bold"
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  PHONE NUMBER
                </Typography>
                <Typography
                  component="h1"
                  variant="h5"
                  marginTop="10px"
                  marginLeft="15px"
                >
                  0{data.owner.phone_number}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "inline-grid",
                  gridAutoFlow: "row",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridTemplateRows: "repeat(1, 1fr)",
                  columnGap: "50px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => navigate(`/editpatient/${data.owner.id}`)}
                >
                  Edit Patient
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => handleDelete("patient", data.owner.id)}
                >
                  Delete Patient
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() =>
                    navigate(`/createnote/${data.owner.id}/${data.owner.name}`)
                  }
                >
                  Create Note
                </Button>
              </Box>
            </Box>
          </Box>
          {data.notes && (
            <>
              {data.notes.map((note, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      width: "50vw",
                      overflow: "auto",
                      marginTop: "10px",
                      bgcolor: "#ffffff",
                      display: "inline-block",
                    }}
                  >
                    <Box>
                      <Typography
                        component="h1"
                        variant="h5"
                        marginTop="10px"
                        marginLeft="15px"
                        fontWeight="bold"
                        sx={{ alignItems: "center", justifyContent: "center" }}
                      >
                        DISEASE/ILLNESS/INJURY
                      </Typography>
                      <Typography
                        component="h1"
                        variant="h5"
                        marginTop="10px"
                        marginLeft="15px"
                      >
                        {note.title}
                      </Typography>
                      <Typography
                        component="h1"
                        variant="h5"
                        marginTop="10px"
                        marginLeft="15px"
                        fontWeight="bold"
                        sx={{ alignItems: "center", justifyContent: "center" }}
                      >
                        SYMPTOMS/OBSERVATIONS
                      </Typography>
                      <Typography
                        component="h1"
                        variant="h5"
                        marginTop="10px"
                        marginLeft="15px"
                      >
                        {note.disease_symptoms}
                      </Typography>
                      <Typography
                        component="h1"
                        variant="h5"
                        marginTop="10px"
                        marginLeft="15px"
                        fontWeight="bold"
                        sx={{ alignItems: "center", justifyContent: "center" }}
                      >
                        RECOMMENDATIONS/PRESCRIPTIONS
                      </Typography>
                      <Typography
                        component="h1"
                        variant="h5"
                        marginTop="10px"
                        marginLeft="15px"
                      >
                        {note.prescription}
                      </Typography>
                      <Typography
                        component="h1"
                        variant="h5"
                        marginTop="10px"
                        marginLeft="15px"
                        fontWeight="bold"
                        sx={{ alignItems: "center", justifyContent: "center" }}
                      >
                        DATE OF VISIT (yyyy,mm,dd)
                      </Typography>
                      <Typography
                        component="h1"
                        variant="h5"
                        marginTop="10px"
                        marginLeft="15px"
                      >
                        {note.created_at.slice(0, 10)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "inline-grid",
                        gridAutoFlow: "row",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gridTemplateRows: "repeat(1, 1fr)",
                        columnGap: "50px",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "25%",
                      }}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() =>
                          navigate(
                            `/editnote/${note.id}/${data.owner.name}/${data.owner.id}`
                          )
                        }
                      >
                        Edit Note
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => handleDelete("note", note.id)}
                      >
                        Delete Note
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default Notes;
