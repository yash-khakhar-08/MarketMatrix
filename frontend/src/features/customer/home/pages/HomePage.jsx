import { useEffect, useMemo, useState } from "react"
import Slider from "../../components/Slider"
import ProductItem from "../../components/ProductItem"
import { fetchAllProducts } from "../../products/services/product.service"

const HomePage = ({ sectionName }) => {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        const loadProducts = async () => {
            try {
                const data = await fetchAllProducts({ sectionName })
                if (isMounted) setProducts(data)
            } catch (err) {
                console.error("Failed to load products", err)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadProducts()

        return () => { isMounted = false }
    }, [sectionName])

    const validCategories = useMemo(
        () => products.filter(p => p.productResponse?.length > 0),
        [products]
    )

    if (loading) {
        return <h4 className="p-4">Loading products...</h4>
    }

    return (
        <>
            {sectionName === "" && <Slider />}

            {validCategories.length > 0 ? (
                validCategories.map(category => (
                    <div key={category.id} className="container-fluid mt-2 p-4">
                        <h2 id={category.id}>
                            Category: {category.catName} - {category.sectionName}
                        </h2>

                        <div className="row align-items-start">
                            <ProductItem
                                categoryId={category.id}
                                productItems={category.productResponse}
                            />
                        </div>
                    </div>
                ))
            ) : (
                <h4 className="pl-2">No Products available</h4>
            )}
        </>
    )
}

export default HomePage