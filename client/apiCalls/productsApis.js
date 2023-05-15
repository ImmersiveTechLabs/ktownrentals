export const fetchProducts = async(value,setOpen, setLoading, setProducts, fetch)=>{
    try{
        setOpen(true)
        setLoading(true)
        const response = await fetch(`/products?search=${value}`,{
            method:'GET',
        })
        const res = await response.json()
        setProducts(res.body?.data?.products?.nodes)
        setLoading(false)
    }
    catch(err){
        setLoading(false)
        console.log(err)
    }
}

export const fetchVariants = async(productId, fetch, setVariants,setVariantsLoading)=>{
    try{
        setVariantsLoading(true)
        const response = await fetch(`/products/variants/${productId}`,{
            method:'GET',
        })
        const res = await response.json()
        setVariants(res.variants.nodes)
        setVariantsLoading(false)
    }
    catch(err){
        setVariantsLoading(false)
        console.log(err)
    }
}

export const fetchMetafields = async(variantId,productId, fetch, setVariantMetafields,setProductMetafields,setVariantsLoading)=>{
    try{
        setVariantsLoading(true)
        const response = await fetch(`/products/metafields?variantId=${variantId}&productId=${productId}`,{
            method:'GET',
        })
        const res = await response.json()
        setVariantMetafields(res.variantMetafields.metafields.nodes)
        setProductMetafields(res.productMetafields.metafield)
    }
    catch(err){
        setVariantsLoading(false)
        console.log(err)
    }
}
