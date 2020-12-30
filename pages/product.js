const Product = () => {
  return (
    <div>
      <h1>Product</h1>
    </div>
  );
};

export async function getStaticProps({ query }) {
  console.log(query);
  return {
    props: {},
  };
}

export default Product;
