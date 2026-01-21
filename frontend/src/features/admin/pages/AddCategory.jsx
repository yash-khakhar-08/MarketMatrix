import { useState, useCallback } from 'react'
import { addCategory } from '../services/category.service'
import { useSelector } from 'react-redux'

const AddCategory = () => {

    const {token} = useSelector(state => state.auth)

    const [category, setCategory] = useState({
        catName: '',
        sectionName: ''
    })

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setCategory(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!category.catName.trim() || !category.sectionName) {
            setMessage('Please add a category')
            return
        }

        setLoading(true)
        setMessage('')

        try {

            await addCategory(token, category)

            setMessage('Category Added Successfully!')

            setCategory({
                catName: '',
                sectionName: ''
            })

        } catch (error) {
            console.error('Error adding category: ', error)
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='container border p-3 w-50'>
        <h4 className='text-center mb-3'>Add Category</h4>
        {message && <h5 className='text-center'>{message}</h5>}

        <form onSubmit={handleSubmit}>

            <div className='form-group'>
            <label>Select Section Name</label>
            <select
                name="sectionName"
                className='form-control'
                value={category.sectionName}
                onChange={handleChange}
                disabled={loading}
                required
            >
                <option value='' disabled>
                --Select Section Name--
                </option>

                <option value="men">
                    Men
                </option>

                <option value="women">
                    Women
                </option>

            </select>
            </div>
            
            <div className='form-group'>
            <label>Category Name</label>
            <input
                type='text'
                className='form-control'
                name='catName'
                value={category.catName}
                onChange={handleChange}
                placeholder='Category name'
                disabled={loading}
                required
            />
            </div>

            <button
            type='submit'
            className='btn btn-primary w-100 mt-2'
            disabled={loading}
            >
            {loading ? 'Adding Category...' : 'Add Category'}
            </button>
        </form>
        </div>
    )
}

export default AddCategory