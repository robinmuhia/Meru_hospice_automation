import React from "react";
import { useGetDashboardQuery } from "state/api";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const userId = useSelector((state) => state.global.user.id);
  const { data, isloading } = useGetDashboardQuery(userId);
  console.log(data);
  return <div>Dashboard</div>;
};

export default Dashboard;
