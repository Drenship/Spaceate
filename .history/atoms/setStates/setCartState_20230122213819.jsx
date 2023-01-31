export const CART_ADD_ITEM = "CART_ADD_ITEM";
export const CART_REMOVE_ITEM = "CART_REMOVE_ITEM";
export const CART_EMPTY = "CART_EMPTY";

export const setCartState = (props) => {

    const { action, product, cartItem, setCartItem } = props

    switch (action) {
        case CART_ADD_ITEM:

            if (cartItem.findIndex(pro => pro.slug === product.slug) === -1) {
                setCartItem(prevState => [...prevState, product])
            } else {
                setCartItem(prevState => {
                    return prevState.map((item) => {
                        return item.slug === product.slug ? { ...item, quantity: product.quantity } : item
                    })
                })
            }
            return;

        case CART_REMOVE_ITEM:
            setCartItem(prevState => prevState.filter((p) => p.slug !== product.slug));
            return;

        case CART_EMPTY:
            setCartItem([]);
            return;

        default:
            return;
    }
}