import React, { createContext, useReducer, useContext, useEffect } from 'react'

const CartStateContext = createContext()
const CartDispatchContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const idx = state.items.findIndex(i => i.productId === action.item.productId)
      let items = [...state.items]
      if (idx >= 0) { items[idx].quantity += action.item.quantity }
      else items.push(action.item)
      return { ...state, items }
    }
    case 'remove': {
      return { ...state, items: state.items.filter(i => i.productId !== action.productId) }
    }
    case 'update': {
      return { ...state, items: state.items.map(i => i.productId === action.productId ? { ...i, quantity: action.quantity } : i) }
    }
    case 'clear': return { items: [] }
    default: return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, (init) => {
    try { const s = localStorage.getItem('gb_cart'); return s ? JSON.parse(s) : init } catch { return init }
  })
  useEffect(() => { localStorage.setItem('gb_cart', JSON.stringify(state)) }, [state])
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartDispatchContext.Provider>
  )
}

export function useCartState() { return useContext(CartStateContext) }
export function useCartDispatch() { return useContext(CartDispatchContext) }
