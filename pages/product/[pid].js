import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { parseCookies } from "nookies";
import Cookie from "js-cookie";

import baseUrl from "../../helpers/baseUrl";

const Product = ({ product }) => {
  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : null;

  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    M.Modal.init(modalRef.current);
  }, []);

  const onChangeQuantity = useCallback(
    (e) => {
      setQuantity(Number(e.target.value));
    },
    [quantity]
  );

  const addToCart = async () => {
    const res = await fetch(`${baseUrl}cart`, {
      method: "PUT",
      headers: {
        Authorization: cookie.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,
        quantity,
      }),
    });

    const res2 = await res.json();
    res2;
    if (res2.error) {
      M.toast({ html: res2.error, classes: "red" });
      Cookie.remove("token");
      Cookie.remove("user");
      router.push("/login");
    } else {
      M.toast({ html: res2.message, classes: "green" });
    }
  };

  const deleteProduct = async () => {
    await fetch(`${baseUrl}product/${product._id}`, {
      method: "DELETE",
    });
    router.replace("/");
  };

  if (router.isFallback) {
    return <h3>Loading...</h3>;
  }

  const getModal = () => (
    <div id="modal1" className="modal" ref={modalRef}>
      <div className="modal-content">
        <h4 style={{ textTransform: "capitalize" }}>{product.name}</h4>
        <p>Are you sure, you want to delete?</p>
      </div>
      <div className="modal-footer">
        <button className="btn waves-effect waves-light #1565c0 blue darken-3">
          Cancel
        </button>
        <button
          className="btn waves-effect waves-light #c62828 red darken-3"
          onClick={deleteProduct}
        >
          Yes
        </button>
      </div>
    </div>
  );

  return (
    <div className="container center-align">
      <h3 style={{ textTransform: "capitalize" }}>{product.name}</h3>
      <Image
        src={product.mediaUrl}
        alt="Product Image"
        width={300}
        height={300}
      />
      <h5>Rs. {product.price}</h5>
      <input
        type="number"
        style={{ width: "400px", margin: "10px" }}
        min={1}
        placeholder="Quantity"
        value={quantity}
        onChange={onChangeQuantity}
      />
      {user ? (
        <button
          className="btn waves-effect waves-light #1565c0 blue darken-3"
          onClick={addToCart}
        >
          Add
          <i className="material-icons right">add</i>
        </button>
      ) : (
        <button
          className="btn waves-effect waves-light #1565c0 blue darken-3"
          onClick={() => router.push("/login")}
        >
          Login To Add
          <i className="material-icons right">add</i>
        </button>
      )}
      <p className="left-align">{product.description}</p>
      {user && user?.role !== "user" && (
        <button
          data-target="modal1"
          className="btn modal-trigger waves-effect waves-light #c62828 red darken-3"
        >
          Delete
          <i className="material-icons left">delete</i>
        </button>
      )}
      {getModal()}
    </div>
  );
};

// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { pid: "5fe58e8974b4ca79110122e9" } }],
//     fallback: true,
//   };
// }

// export async function getStaticProps({ params: { pid } }) {
//   const res = await fetch(`${baseUrl}product/${pid}`);
//   const product = await res.json();
//   return {
//     props: { product },
//   };
// }

export async function getServerSideProps({ params: { pid } }) {
  const res = await fetch(`http://localhost:3000/api/product/${pid}`);
  const product = await res.json();
  return {
    props: { product },
  };
}

export default Product;
