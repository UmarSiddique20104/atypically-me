import { Metadata } from "next";
import Dashboard from "./Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Generated by create next app",
};
function page() {
  return (
    <>
      <Dashboard />
    </>
  );
}

export default page;
