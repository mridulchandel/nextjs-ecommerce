import { useEffect, useRef } from "react";
import { parseCookies } from "nookies";

import baseUrl from "../helpers/baseUrl";
import styles from "../styles/Order.module.css";
import UserRoles from "../components/UserRoles";

const Account = ({ error, orders }) => {
  const { order_customerDetail } = styles;

  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : "";

  const orderRef = useRef(null);

  useEffect(() => {
    M.Collapsible.init(orderRef.current);
  }, []);

  const OrderHistory = () => {
    return (
      <ul className="collapsible" ref={orderRef}>
        {orders.map((order) => (
          <li key={order._id}>
            <div className="collapsible-header">
              <i className="material-icons">folder</i>
              {order.createdAt}
            </div>
            <div className="collapsible-body">
              <h5>Total: ₹{order.total}</h5>
              {order.products.map((pItem) => (
                <h6 key={pItem._id}>
                  {pItem.product.name} x {pItem.quantity}
                </h6>
              ))}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container ">
      <div className={`center-align white-text ${order_customerDetail}`}>
        <h4>Name: {user.name}</h4>
        <h4>Email: {user.email}</h4>
      </div>
      <h3>Order History</h3>
      {orders.length > 0 ? (
        <OrderHistory />
      ) : (
        <div className="container center-align">
          <h5>You have no order history</h5>
        </div>
      )}
      {user.role === "root" && <UserRoles />}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { token } = parseCookies(ctx);
  if (!token) {
    const { res } = ctx;
    res.writeHead(302, { Location: "/login" });
    res.end();
  }

  const res = await fetch(`${baseUrl}order`, {
    headers: {
      Authorization: token,
    },
  });

  const res2 = await res.json();

  if (res2.error) {
    return {
      props: {
        error: res2.error,
      },
    };
  }
  return {
    props: {
      orders: res2.orders,
    },
  };
}

export default Account;
