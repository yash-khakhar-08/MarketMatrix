import { Routes, Route } from "react-router-dom"

import AuthLayout from "../layouts/AuthLayout"
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CustomerLayout from "../layouts/CustomerLayout"
import CartPage from "../features/customer/cart/pages/CartPage"
import ProductInfo from "../features/customer/products/pages/ProductInfo"
import PageNotFound from "../app/pages/PageNotFound"
import ChatbotPage from "../features/customer/home/pages/ChatbotPage"
import ProtectedRoute from "./ProtectedRoute"
import AdminLayout from "../features/admin/layouts/AdminLayout"
import AdminRoute from "./AdminRoute"
import UnauthorizedAccessPage from "../app/pages/UnauthorizedAccessPage"
import EditProfilePage from "../features/customer/profile/pages/EditProfilePage"
import StripeLayout from "../layouts/StripeLayout"

import {
    CheckoutPage,
    ViewOrderPage
} from "../features/customer/orders"

import {
    HomePage, 
    SearchPage
} from "../features/customer/home"

import { 
    AddCategory, 
    AddProduct, 
    AdminDashboard,
    CategoriesPage,
    ProductsPage,
    EditProductPage,
    CustomersPage,
    EditCustomerPage,
    OrdersPage,
    EditOrderPage
} from "../features/admin"
import PaymentPage from "../features/customer/orders/pages/PaymentPage"
import PaymentSuccess from "../features/customer/orders/pages/PaymentSuccess"
import PaymentFailure from "../features/customer/orders/pages/PaymentFailure"

const AppRoutes = () => {
    return (
        <Routes>

            <Route element={<AuthLayout />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage sectionName="" />} />
                <Route path="/men" element={<HomePage sectionName="Men" />} />
                <Route path="/women" element={<HomePage sectionName="Women" />} />
                <Route path="/search-results" element={<SearchPage />} />
                <Route path="/productInfo" element={<ProductInfo />} />
                <Route path="/chat" element={<ChatbotPage /> } />

                <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage /> } />
                    <Route path="/payment" element={<StripeLayout><PaymentPage /></StripeLayout>} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/failure" element={<PaymentFailure />} />
                    <Route path="/orders" element={<ViewOrderPage />} />
                    <Route path="/editProfile" element={<EditProfilePage />} />
                </Route>
            </Route>

            <Route element={<AdminLayout />}>
                <Route element={<AdminRoute />}>
                    <Route path="/admin/" element={<AdminDashboard />} />
                    <Route path="/admin/addProduct" element={<AddProduct />} />
                    <Route path="/admin/addCategory" element={<AddCategory />} />
                    <Route path="/admin/manage-category" element={<CategoriesPage />} />
                    <Route path="/admin/manage-products" element={<ProductsPage />} />
                    <Route path="/admin/product/edit" element={<EditProductPage />} />
                    <Route path="/admin/manage-customers" element={<CustomersPage />} />
                    <Route path="/admin/customer/edit" element={<EditCustomerPage />} />
                    <Route path="/admin/manage-orders" element={<OrdersPage />} />
                    <Route path="/admin/order/edit" element={<EditOrderPage />} />
                </Route>
            </Route>
            
            <Route path="/unauthorized-access" element={<UnauthorizedAccessPage />} />

            <Route path="*" element={<PageNotFound />} />

        </Routes>
    )
}

export default AppRoutes
