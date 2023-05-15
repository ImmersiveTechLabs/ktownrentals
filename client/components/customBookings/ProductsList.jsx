import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Button,
  } from '@shopify/polaris';
  import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedDate, setSelectedProduct, setSelectedTime, setSelectedVariant, setTimes } from '../../redux/slices/customBookingSlice';

  const ProductsList =({products,setOpen})=> {

    const dispatch = useDispatch()


    const handleSelectedProduct = (product)=>{
        dispatch(setSelectedProduct(product))
        setOpen(false)
        dispatch(setSelectedVariant(null))
        dispatch(setSelectedDate(null))
        dispatch(setTimes(null))
        dispatch(setSelectedTime(null))
    }

    const resourceName = {
      singular: 'product',
      plural: 'products',
    };
      useIndexResourceState(products);
    const rowMarkup = products?.map((product,index,) => {
          const {title,id,images} = product
          return(
            <IndexTable.Row
            id={id}
            key={id}
            position={index}
        >
          <IndexTable.Cell><img className='custom-bookings-product-image' src={images.nodes[0].url} /></IndexTable.Cell>
          <IndexTable.Cell>{title}</IndexTable.Cell>
          <IndexTable.Cell><Button  onClick={()=>handleSelectedProduct(product)}>Select</Button></IndexTable.Cell>
        </IndexTable.Row>
  )
  },
    );

    return (
      <LegacyCard>
        {
          products &&
          <IndexTable
          hasMoreItems={true}
        selectable={false}
          resourceName={resourceName}
          itemCount={products?.length}
          headings={[
            {title: 'Image'},
            {title: 'Title'},
          ]}
        >
          {rowMarkup}
        </IndexTable>
    }
      </LegacyCard>
    );
  }
  export default ProductsList
