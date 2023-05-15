import { useAppBridge } from "@shopify/app-bridge-react";
import {  Frame, Layout, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import '../styles/custombookings.css'
import ProductModal from "../components/customBookings/ProductsModal";
import SelectedProduct from '../components/customBookings/SelectedProduct'
import Customer from "../components/customBookings/Customer";
import { resetState } from "../redux/slices/customBookingSlice";

const CustomBookings = () => {
  const app = useAppBridge();
  const dispatch = useDispatch()
  const handleBack = ()=>{
     navigate("/")
     dispatch(resetState())
  }
  const {selectedProduct} = useSelector(state=>state.customBooking)

  return (
    <Frame>
    <Page
    title="Custom Bookings"
    breadcrumbs={[{ content: "Home", onAction: handleBack }]}
    >
      <Layout >
        <Customer />
        <ProductModal />

        {
          selectedProduct &&
        <SelectedProduct />
        }
      </Layout>
    </Page>
    </Frame>
  );
};

export default CustomBookings;
