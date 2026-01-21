import { useEffect, useState, useCallback } from "react"
import { fetchCategories } from "../services/category.service"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import { deleteCategory } from "../services/category.service"

const CategoriesPage = () => {

    const { token } = useSelector(state => state.auth)

    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {

        setLoading(true)

        try {
            const data = await fetchCategories(token)
            setCategories(data)
        } catch (err) {
            setMessage(err.message)
        } finally {
            setLoading(false)
        }

    }

    const handleDeleteCategory = useCallback(async (id) => {
        
        const result = await Swal.fire({
            title: "Delete Category?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it"
        })

        if (result.isConfirmed) {

            try {

                const payload = {
                    categoryId: id
                }

                await deleteCategory(token, payload)

                setCategories(prev => prev.filter(cat => cat.id !== id))

                Swal.fire("Deleted!", "Category has been removed.", "success")

            } catch (err) {
                Swal.fire("Error", err.message, "error")
            }

        }

    }, [])

    const filteredCategories = categories.filter(cat =>
        cat.catName.toLowerCase().startsWith(search.toLowerCase()) ||
        cat.sectionName.toLowerCase().startsWith(search.toLowerCase())
    )

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">📂 Category Management</h4>
        </div>

        <div className="card-body">
          {message && <div className="alert alert-danger">{message}</div>}

          <div className="row mb-3">
            <div className="col-md-4 ms-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Search category or section..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" />
              <p className="mt-2">Loading categories...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Section</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map(cat => (
                      <tr key={cat.id}>
                        <td>{cat.id}</td>
                        <td className="fw-semibold">{cat.catName}</td>
                        <td>{cat.sectionName}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-danger mx-2"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage