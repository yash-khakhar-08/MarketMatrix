import { useState, useEffect, useCallback } from 'react'
import { addProduct } from '../services/product.service'
import { fetchCategories } from '../services/category.service'
import { useSelector } from 'react-redux'

const AddProduct = () => {

    const {token} = useSelector(state => state.auth)

    const [product, setProduct] = useState({
        productName: '',
        productDesc: '',
        productPrice: '',
        productQty: ''
    })

    const [file, setFile] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const loadCategories = async () => {
            try {
                const data = await fetchCategories(token)
                setCategories(data)
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }

        loadCategories()

    }, [])

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setProduct(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleCategoryChange = useCallback((e) => {
        setSelectedCategory(e.target.value)
    }, [])

    const handleFileChange = useCallback((e) => {
        setFile(e.target.files[0])
    }, [])

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!selectedCategory) {
            setMessage('Please select a category')
            return
        }

        if (!file) {
            setMessage('Please upload a product image')
            return
        }

        setLoading(true)
        setMessage('')

        try {

            const formData = new FormData()
            formData.append('product', JSON.stringify(product))
            formData.append('image', file)
            formData.append('selectedCategory', selectedCategory)

            await addProduct(token, formData)

            setMessage('Product Added Successfully!')

            setProduct({
                productName: '',
                productDesc: '',
                productPrice: '',
                productQty: ''
            })

            setFile(null)

            setSelectedCategory('')

        } catch (error) {
            console.error('Error adding product: ', error)
            setMessage('Something went wrong on the server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='container border p-3 w-50'>
        <h4 className='text-center mb-3'>Add Product</h4>
        {message && <h5 className='text-center'>{message}</h5>}

        <form onSubmit={handleSubmit} encType='multipart/form-data'>
            <div className='form-group'>
            <label>Select Category</label>
            <select
                className='form-control'
                value={selectedCategory}
                onChange={handleCategoryChange}
                disabled={loading}
                required
            >
                <option value='' disabled>
                --Select Category--
                </option>
                {categories.length > 0 ? (
                categories.map((cat) => (
                    <option key={cat.id} value={JSON.stringify(cat)}>
                    {cat.catName} - {cat.sectionName}
                    </option>
                ))
                ) : (
                <option value='' disabled>
                    No Categories
                </option>
                )}
            </select>
            </div>

            <div className='form-group'>
            <label>Product Name</label>
            <input
                type='text'
                className='form-control'
                name='productName'
                value={product.productName}
                onChange={handleChange}
                placeholder='Product name'
                disabled={loading}
                required
            />
            </div>

            <div className='form-group'>
            <label>Product Description</label>
            <textarea
                className='form-control'
                name='productDesc'
                value={product.productDesc}
                onChange={handleChange}
                disabled={loading}
                required
            />
            </div>

            <div className='form-group'>
            <label>Product Price</label>
            <input
                type='number'
                className='form-control'
                name='productPrice'
                value={product.productPrice}
                onChange={handleChange}
                disabled={loading}
                required
            />
            </div>

            <div className='form-group'>
            <label>Product Quantity</label>
            <input
                type='number'
                className='form-control'
                name='productQty'
                value={product.productQty}
                onChange={handleChange}
                disabled={loading}
                required
            />
            </div>

            <div className='form-group'>
            <label>Product Image</label>
            <input
                type='file'
                name='image'
                accept='image/*'
                onChange={handleFileChange}
                className='form-control'
                disabled={loading}
                required
            />
            </div>

            <button
            type='submit'
            className='btn btn-primary w-100 mt-2'
            disabled={loading}
            >
            {loading ? 'Adding Product...' : 'Add Product'}
            </button>
        </form>
        </div>
    )
}

export default AddProduct