import { Banner, Button, DatePicker, Layout, LegacyCard, Spinner, Text, Thumbnail } from '@shopify/polaris'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchavailableTimesForCustomOrder, handleCreateOrder } from '../../apiCalls/ordersApis';
import moment from 'moment';
import { fetchVariants } from '../../apiCalls/productsApis';
import { useNavigate } from 'raviger';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { setSelectedDate, setSelectedTime, setSelectedVariant } from '../../redux/slices/customBookingSlice';

const SelectedProduct = () => {
    //Loading States
    const [createOrderLoading, setCreateOrderLoading] = useState(false);
    const [checkBookingLoading, setCheckBookingLoading] = useState(false);
    const [variantsLoading, setVariantsLoading] = useState(false);
    //States
    const { selectedProduct, selectedVariant, selectedDate, times, selectedTime, customer } = useSelector(state => state.customBooking)
    const [variants, setVariants] = useState(null);

    const navigate = useNavigate()
    const fetch = useFetch()
    const variantId = selectedVariant?.id.split('/')[4]
    const productId = selectedProduct?.id.split('/')[4]
    const variantTitle = selectedVariant?.title.at(0)
    const openingTime = selectedVariant?.metafields?.nodes.find((m) => m.namespace === "open").value
    const closingTime = selectedVariant?.metafields?.nodes.find((m) => m.namespace === "close").value
    const gap = selectedProduct?.metafield?.value
    const currentDate = moment()
    const currentMonth = currentDate.clone().subtract(1, 'month').format("M") // I did this because there is some bug is polaris, lets say if I give it march it selects april
    const yesterday = currentDate.clone().subtract(1, 'day').toDate()
    useEffect(() => {
        selectedDate && fetchavailableTimesForCustomOrder(setCheckBookingLoading, dispatch, productId, variantTitle, moment(selectedDate).format("YYYY-MM-DD"), openingTime, closingTime, gap)
    }, [selectedDate, selectedVariant])

    useEffect(() => {
        productId && fetchVariants(productId, fetch, setVariants, setVariantsLoading)
    }, [selectedProduct])
    const [{ month, year }, setDate] = useState({ month: parseInt(currentMonth), year: currentDate.format("YYYY") });
    const handleMonthChange = useCallback((month, year) => setDate({ month, year }), [],);
    const dispatch = useDispatch()
    return (
        <Layout.Section>
            <LegacyCard
                primaryFooterAction={{
                    content: "Create",
                    onAction: () => handleCreateOrder({
                        variantId,
                        bookingDate: moment(selectedDate).format("YYYY-MM-DD"),
                        time: selectedTime,
                        customer
                    },
                        setCreateOrderLoading,
                        navigate,
                        fetch,
                        dispatch
                    ),
                    loading: createOrderLoading,
                    disabled: selectedTime === null
                }}
                title="Selected Product" sectioned>
                <div className='custom-bookings-selected-product-container'>
                    <Thumbnail size='large' source={selectedProduct.images.nodes[0].url} />
                    <Text variant='headingMd' as='h6' fontWeight='regular' >{selectedProduct.title}</Text>
                </div>
                <h1 className='variant-label'><b>Variants Format:</b> Hours/Deposit/Sound System Or Toys</h1>
                <div className='custom-bookings-variants-container'>
                    {
                        variantsLoading ? <Spinner /> :
                            variants?.map((variant) => (
                                <Button disabled={checkBookingLoading} key={variant.id} size='slim' primary={selectedVariant?.title === variant.title} onClick={() => dispatch(setSelectedVariant(variant))}>{variant.title}</Button>
                            ))
                    }
                </div>
                <div className='custom-bookings-dates-container'>
                    <div className={`custom-bookings-date-picker ${checkBookingLoading && 'disabled'}`}>
                        {
                            selectedVariant &&
                            <DatePicker
                                disabled={true}
                                month={month}
                                year={year}
                                disableDatesBefore={yesterday}
                                selected={selectedDate}
                                onChange={(date) => dispatch(setSelectedDate(date.start))}
                                onMonthChange={handleMonthChange}
                            />
                        }
                    </div>
                    <div className='custom-booking-available-times-container'>
                        {
                            checkBookingLoading ? <Spinner /> :
                                times?.length !== 0 ? times?.map((time) => (
                                    <Button key={time} onClick={() => dispatch(setSelectedTime(time))} primary={selectedTime === time} size='slim'>{time}</Button>
                                ))
                                    :
                                    <Banner title='No Bookings Found' status='critical' />
                        }
                    </div>
                </div>
            </LegacyCard>
        </Layout.Section>
    )
}

export default SelectedProduct
