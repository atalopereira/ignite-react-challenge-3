import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      let newStok: Stock[] = [];
      const productInStock = await api.get<Stock[]>('stock').then(response => {
        newStok = response.data;
        return response.data.find((currentProduct, index) => {
          if (currentProduct.id === productId) {
            newStok[index].amount = newStok[index].amount - 1
            return currentProduct
          }
          return undefined
        })
      })

      if (productInStock) {
        const IndexProductInCart = cart.findIndex(currentCart => currentCart.id === productId)
        
        if (IndexProductInCart !== -1) {
          const newCart = [...cart];
          newCart[IndexProductInCart].amount = newCart[IndexProductInCart].amount + 1

          setCart(newCart)
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
          // api.patch('stock', newStok)
        } else {
          await api.get<Product[]>('products').then(response => {
            const productFinded = response.data.find(currentProduct => currentProduct.id === productId)
            
            if (productFinded) {
              const newCart = [
                ...cart,
                {
                  ...productFinded,
                  amount: 1
                }
              ]
  
              setCart(newCart)
              localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
              // api.patch('stock', newStok)
            }
          })
        }
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const productInStock = await api.get<Stock[]>('stock').then(
        response => response.data.find(
          currentProductStock => currentProductStock.id === productId
        )
      )

      if (productInStock && productInStock?.amount >= amount) {
        const cartFindedIndex = cart.findIndex(currentCart => currentCart.id === productId)

        if (cartFindedIndex !== -1) {
          const newCart = [...cart]
          newCart[cartFindedIndex].amount = amount

          setCart(newCart);
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
        }
      } else {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
