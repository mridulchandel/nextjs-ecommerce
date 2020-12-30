const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://mystore145263.vercel.app/api/"
    : "http://localhost:3000/api/";

export default baseUrl;
