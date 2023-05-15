import {Layout, LegacyCard, TextField } from '@shopify/polaris'
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerFirstName, setCustomerLastName,setCustomerEmail } from '../../redux/slices/customBookingSlice';

const Customer = () => {
    const dispatch = useDispatch()
    const {customer } = useSelector(state=>state.customBooking)

    return (
        <Layout.Section>
            <LegacyCard
             title="Customer"
              sectioned>
                <TextField
                 value={customer.firstName}
                 onChange={(newValue)=>dispatch(setCustomerFirstName(newValue))}
                 placeholder="First name"
                 requiredIndicator
                  />
                <TextField
                 value={customer.lastName}
                 onChange={(newValue)=>dispatch(setCustomerLastName(newValue))}
                 placeholder="Last name"
                 requiredIndicator
                  />
                <TextField
                 value={customer.email}
                 type='email'
                 requiredIndicator
                 onChange={(newValue)=>dispatch(setCustomerEmail(newValue))}
                 placeholder="Email"
                  />
            </LegacyCard>

        </Layout.Section>
    )
}

export default Customer
