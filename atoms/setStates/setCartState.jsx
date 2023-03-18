export const CART_ADD_ITEM = "CART_ADD_ITEM";
export const CART_UPDATE_ITEM = "CART_UPDATE_ITEM";
export const CART_REMOVE_ITEM = "CART_REMOVE_ITEM";
export const CART_EMPTY = "CART_EMPTY";

export const setCartState = (props) => {

    const { action, product, cartItem, setCartItem } = props

    switch (action) {
        case CART_ADD_ITEM:

            if (cartItem.findIndex(pro => pro.slug === product.slug) === -1) {
                setCartItem(prevState => [...prevState, {...product, outOfStock: false, outOfQuantity: false}])
            } else {
                setCartItem(prevState => {
                    return prevState.map((item) => {
                        return item.slug === product.slug ? { ...item, quantity: product.quantity, outOfStock: false, outOfQuantity: false } : item
                    })
                })
            }
            return;
        case CART_UPDATE_ITEM:
            setCartItem(prevState => {
                return prevState.map((item) => {
                    if (product.countInStock <= 0 && item.slug === product.slug) return Object.assign({ ...item }, { ...product, outOfStock: true, outOfQuantity: true });
                    if (item.quantity > product.countInStock && item.slug === product.slug) return Object.assign({ ...item }, { ...product, outOfQuantity: true, outOfStock: false });
                    return item.slug === product.slug ? Object.assign({ ...item }, { ...product, outOfStock: false, outOfQuantity: false }) : item
                })
            })
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