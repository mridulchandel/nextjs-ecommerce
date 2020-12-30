import { useState } from "react";
import baseUrl from "../helpers/baseUrl";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

const Create = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [description, setDescription] = useState("");

  const imageUpload = async () => {
    const formData = new FormData();
    formData.append("file", mediaUrl);
    formData.append("upload_preset", "gijzs13m");
    const options = {
      method: "POST",
      body: formData,
    };

    const res = await fetch(
      " https://api.cloudinary.com/v1_1/decodify/image/upload",
      options
    );
    const uploadData = await res.json();
    return uploadData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedObj = await imageUpload();
    try {
      const res = await fetch(`${baseUrl}products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          mediaUrl: uploadedObj.url,
          description,
        }),
      });
      const res2 = await res.json();
      if (res2.error) {
        M.toast({ html: res2.error, classes: "red" });
      } else {
        M.toast({ html: "Product Saved", classes: "green" });
        router.replace("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        name="price"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #1565c0 blue darken-3">
          <span>File</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMediaUrl(e.target.files[0])}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <img
        className="responsive-img"
        src={mediaUrl ? URL.createObjectURL(mediaUrl) : ""}
        alt="Product Image"
      />
      <textarea
        name="description"
        className="materialize-textarea"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button
        className="btn waves-effect waves-light #1565c0 blue darken-3"
        type="submit"
      >
        Submit
        <i className="material-icons right">send</i>
      </button>
    </form>
  );
};

export async function getServerSideProps(ctx) {
  const cookie = parseCookies(ctx);

  const user = cookie.user ? JSON.parse(cookie.user) : null;

  const { res } = ctx;
  if (!user) {
    res.writeHead(302, { Location: "/login" });
    res.end();
  } else if (user.role !== "admin") {
    res.writeHead(302, { Location: "/account" });
    res.end();
  }
  return {
    props: {},
  };
}

export default Create;
