import { Button, Layout, LegacyCard, Modal, Spinner, TextField } from '@shopify/polaris'
import React, { useCallback, useState } from 'react'
import useFetch from '../../hooks/useFetch';
import ProductsList from './ProductsList';
import { fetchProducts } from '../../apiCalls/productsApis';

const ProductModal = () => {
    //States
    const [products, setProducts] = useState(null);
    const [value, setValue] = useState('');
    const [open, setOpen] = useState(false);
    //Loading States
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((newValue) => setValue(newValue), []);
    const fetch = useFetch()

    return (
        <Layout.Section>
            <LegacyCard
             title="Products"
              sectioned>
                <TextField
                 value={value}
                 onChange={handleChange}
                 connectedRight={<Button onClick={()=>fetchProducts(value,setOpen,setLoading,setProducts,fetch)}>{value.length < 1 ? "All" : "Search"}</Button>}
                 placeholder="Search Products"
                  />
                <Modal title="Products" open={open} onClose={()=>setOpen(false)}>
                    <Modal.Section>
                        {
                            loading ?
                            <div className='custom-bookings-products-search-loading'>
                            <Spinner   />
                            </div>
                            :
                            <div className='custom-bookings-products-list-container'>
                            <ProductsList setOpen={setOpen} products={products} />
                            </div>
                        }
                    </Modal.Section>
                </Modal>
            </LegacyCard>

        </Layout.Section>
    )
}

export default ProductModal
