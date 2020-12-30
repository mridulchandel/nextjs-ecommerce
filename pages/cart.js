import { useState } from "react";
import Link from "next/link";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import StripeCheckout from "react-stripe-checkout";

import styles from "../styles/Cart.module.css";
import baseUrl from "../helpers/baseUrl";

const Cart = ({ error, products }) => {
  const { cart, cart_detail, cart_checkout } = styles;

  const router = useRouter();

  const { token } = parseCookies();

  const [productData, setProductData] = useState(products);

  let total = 0;

  const handleRemove = async (productId) => {
    const res = await fetch(`${baseUrl}cart`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });
    const res2 = await res.json();
    setProductData(res2);
  };

  const handleCheckout = async (paymentInfo) => {
    const res = await fetch(`${baseUrl}payment`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentInfo,
      }),
    });
    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: error, classes: "red" });
    } else {
      M.toast({ html: res2.message, classes: "green" });
      router.replace("/");
    }
  };

  if (!token) {
    return (
      <div className="center-align">
        <h3>Please login to view your cart.</h3>
        <Link href="/login">
          <a>
            <button className="btn #1565c0 blue darken-3">Login</button>
          </a>
        </Link>
      </div>
    );
  }

  if (error) {
    M.toast({ html: error, classes: "red" });
    Cookies.remove("token");
    Cookies.remove("user");
    router.replace("/login");
  }

  const cartItems = () => {
    return (
      <>
        {productData.map((item) => {
          total += item.product.price * item.quantity;
          return (
            <div className={cart} key={item._id}>
              <img
                src={item.product.mediaUrl}
                alt="Product Image"
                width={300}
                height={300}
              />
              <div className={cart_detail}>
                <h6>{item.product.name}</h6>
                <h6>
                  {item.quantity} x {item.product.price}
                </h6>
                <button
                  className="btn waves-effect waves-light #c62828 red darken-3"
                  onClick={() => handleRemove(item.product._id)}
                >
                  Remove
                  <i className="material-icons right">delete</i>
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const totalPrice = () => {
    return (
      <div className={cart_checkout}>
        <h5>Total: ₹{total}</h5>
        <StripeCheckout
          name="My Store"
          amount={total * 100}
          image={productData[0].product.mediaUrl}
          currency="INR"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          token={handleCheckout}
          stripeKey="pk_test_51HJeboBEf6r6bUdibaQYXuBZmmpvA0Lw6bANfmkEoCsepfPTqdSYzx5TSvSQyGc2vMEaSfTW2tTGZlNoOE9bIe4g00Os6NpiVF"
        >
          <button className="btn #1565c0 blue darken-3">Checkout</button>
        </StripeCheckout>
      </div>
    );
  };

  const renderCart = () => {
    return (
      <>
        {cartItems()}
        {totalPrice()}
      </>
    );
  };

  return (
    <div className="container">
      {productData.length > 0 ? renderCart() : <h3>Nothing to show</h3>}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { token } = parseCookies(ctx);
  if (!token) {
    return {
      props: {
        products: [],
      },
    };
  }
  const res = await fetch(`${baseUrl}cart`, {
    headers: {
      Authorization: token,
    },
  });
  const products = await res.json();
  if (products.error) {
    return {
      props: {
        error: products.error,
      },
    };
  }
  return {
    props: { products },
  };
}

export default Cart;
