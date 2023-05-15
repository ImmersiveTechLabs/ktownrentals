import {  Layout, LegacyCard, Page } from '@shopify/polaris';
import {  useNavigate } from 'raviger';
import React from 'react'

const OrderSuccess = () => {
    const orderId  = window.location.search.split('orderId=')[1]
    const navigate = useNavigate()
  return (
    <Page >
    <Layout sectioned >
        <Layout.Section fullWidth>
            <LegacyCard title="Order Created"primaryFooterAction={{
                content:"Go to orders",
                onAction:()=>navigate('/bookings')
            }}>
       <div style={{display:'flex',flexDirection:'column', alignItems:'center', gap:'20px', marginTop:'20px'}}>
        <h1 style={{textAlign:'center'}}>You have successfully created an order. It might take a couple of minutes for the changes to reflect on the store and waiver form. Here is a link to Wavier form of this order.</h1>
       <a target='blank' href={`https://kebc.ca/pages/k-town-rentals-waiver-form?order=${orderId}`}>
       https://kebc.ca/pages/k-town-rentals-waiver-form?order={orderId}
        </a>
       </div>
            </LegacyCard>
        </Layout.Section>
        </Layout>
    </Page>
  )
}

export default OrderSuccess
