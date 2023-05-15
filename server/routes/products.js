import {Router} from 'express'
import clientProvider from '../../utils/clientProvider.js';

const router = Router()

router.get('/', async(req,res)=>{
  try{
      const {search} = req.query
    const { client } = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: false,
      });
        const products =await client.query({
        data:`{
            products(query: "${search}", first: 10) {
                nodes{
                  title
                  id
                  metafield(key:"time" namespace:"gap"){
                    value
                    namespace
                  }
                  images(first:30){
                    nodes{
                      url
                    }
                  }
              }
            }
          }`
      })
      res.status(200).json(products)

  }
  catch(err){
    res.status(500).json(err)
  }
})



router.get('/variants/:productId', async(req,res)=>{
  try{
      const {productId} = req.params
    const { client } = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: false,
      });
        const {body} =await client.query({
        data:`{
          product(id:"gid://shopify/Product/${productId}"){
            variants(first:100){
              nodes{
                title
                id
                metafields(first:5){
                  nodes{
                    namespace
                    value
                  }
                }
              }
            }
          }
        }`
      })
      res.status(200).json(body.data.product)

  }
  catch(err){
    res.status(500).json(err)
  }
})


//This api is used to fetch opening time, closing time and gap between slots for order change

router.get('/metafields', async(req,res)=>{
  try{
      const {variantId,productId} = req.query
      console.log(variantId)
      console.log(productId)
    const { client } = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: false,
      });
        const {body:variantBody} =await client.query({
        data:`{
          productVariant(id:"gid://shopify/ProductVariant/${variantId}"){
            metafields(first:5){
              nodes{
                namespace
                value
              }
            }
          }
        }`
      })
        const {body:productBody} =await client.query({
        data:`{
          product(id:"gid://shopify/Product/${productId}") 	{
            metafield(namespace:"gap" key:"time"){
              value
            }
          }
        }`
      })
      res.status(200).json({
        variantMetafields:variantBody.data.productVariant,
        productMetafields:productBody.data.product,
      })

  }
  catch(err){
    res.status(500).json(err)
  }
})



export default router
