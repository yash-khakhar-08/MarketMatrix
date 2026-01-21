export const getStoredAuth = () => {

    try {

        const raw = localStorage.getItem("customer")
        if (!raw) return { token: null, customer: null, cart: [] }

        const parsed = JSON.parse(raw)

        return {
            token: parsed.token ?? null,
            customer: parsed.userDto ?? null,
            cart: parsed.cartList ?? []
        }

    } catch {
        return { token: null, customer: null, cart: [] }
    }
}
