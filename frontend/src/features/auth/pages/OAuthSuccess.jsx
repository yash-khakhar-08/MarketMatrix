import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { setAuthData } from "../authSlice"
import { getLoginData } from "../services/auth.service"
import Swal from "sweetalert2"

const OAuthSuccess = () => {
    const [params] = useSearchParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const token = params.get("token") 

        if (!token) {
            navigate("/login")
            return
        }

        const fetchLoginData = async () => {
            try {
                const data = await getLoginData({token})

                localStorage.setItem("customer", JSON.stringify(data))

                dispatch(setAuthData({
                    token: data.token,
                    customer: data.userDto,
                    cart: data.cartList
                }))

                await Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    timer: 1200,
                    showConfirmButton: false
                })

                navigate(
                    data.userDto.role === "ROLE_ADMIN" ? "/admin/" : "/",
                    { replace: true }
                )

            } catch (error) {

                console.log(error)

                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: error?.message || "Something went wrong"
                })

                navigate("/login", { replace: true })
            }
        }

        fetchLoginData()

    }, [params, dispatch, navigate]) 

    return <div>Logging you in...</div>
}

export default OAuthSuccess