import React, { useLayoutEffect, useState } from "react";
import Header from "components/Header";
import { Box } from "@mui/material";
import Patient from "components/Patient";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const EditPatient = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.global.token);
  const value = "Edit";
  const [name, setName] = useState("");
  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(0);

  useLayoutEffect(() => {
    const url = `${process.env.REACT_APP_BASE_URL}/patient/${id}`;
    axios
      .get(url, {
        headers: {
          authorization: `${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const ageInYears = Math.floor(res.data.age / 12);
        const ageInMonths = res.data.age % 12;
        setName(res.data.name);
        setAgeYears(ageInYears);
        setAgeMonths(ageInMonths);
        setPhoneNumber(res.data.phone_number);
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
      <Header title="Edit patient" subtitle="Edit existing patient" />
      <Patient
        type={value}
        name={name}
        ageyears={ageYears}
        agemonths={ageMonths}
        phonenumber={phoneNumber}
        id={id}
      />
    </Box>
  );
};

export default EditPatient;
