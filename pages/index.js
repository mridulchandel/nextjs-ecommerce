import Link from "next/link";

import baseUrl from "../helpers/baseUrl";
import styles from "../styles/Home.module.css";

const index = ({ products }) => {
  const { rootcard, cardContainer, cardImageContainer, cardImage } = styles;

  const productsList = products.map((product) => {
    return (
      <div className="row" key={product._id}>
        <div className={cardContainer}>
          <div className="card">
            <div className={`card-image ${cardImageContainer}`}>
              <img src={product.mediaUrl} className={cardImage} />
              <span className="card-title">{product.name}</span>
            </div>
            <div className="card-content">
              <p>₹ {product.price}</p>
            </div>
            <div className="card-action">
              <Link href={`/product/${product._id}`}>
                <a>VIEW PRODUCT</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  });
  return <div className={rootcard}>{productsList}</div>;
};

export async function getStaticProps(context) {
  const res = await fetch(`${baseUrl}products`);
  const data = await res.json();
  return {
    props: {
      products: data,
    },
  };
}

// export async function getServerSideProps(context) {
//   const res = await fetch(`${baseUrl}products`);
//   const data = await res.json();
//   return {
//     props: {
//       products: data,
//     },
//   };
// }

export default index;
