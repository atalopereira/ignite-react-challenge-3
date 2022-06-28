import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  // const cartFormatted = cart.map(product => ({
  //   // TODO
  // }))
  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        return sumTotal + (product.amount * product.price);
      }, 0)
    )

  function handleProductIncrement(product: Product) {
    const params = {
      productId: product.id,
      amount: product.amount + 1
    }
    updateProductAmount(params)
  }

  function handleProductDecrement(product: Product) {
    const params = {
      productId: product.id,
      amount: product.amount + 1
    }
    updateProductAmount(params)
  }

  function handleRemoveProduct(productId: number) {
    // TODO
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        {cart && cart.map(currentCart => (
          <tbody key={currentCart.id}>
            <tr data-testid="product">
              <td>
                <img src={currentCart.image} alt="Tênis de Caminhada Leve Confortável" />
              </td>
              <td>
                <strong>{currentCart.title}</strong>
                <span>{currentCart.price}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                    disabled={currentCart.amount <= 1}
                    onClick={() => handleProductDecrement(currentCart)}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={currentCart.amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                    onClick={() => handleProductIncrement(currentCart)}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>{formatPrice(currentCart.price * currentCart.amount)}</strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
                // onClick={() => handleRemoveProduct(product.id)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </ProductTable>
      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
