import React from "react";
import Header from "../header";
import ErrorIndicator from "../error-indicator";
import Footer from "../footer";
import AddressPage from "../address-page";

const Address = ({ location }) => {
  // if (!location) return <ErrorIndicator />;
  return (
    <>
      <Header />
      <AddressPage />
      <Footer />
    </>
  );
};

export default Address;
