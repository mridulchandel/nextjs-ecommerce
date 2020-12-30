import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";

const Navbar = () => {
  const router = useRouter();

  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : null;

  const isActive = (route) => {
    if (route === router.pathname) {
      return "active";
    }
    return "";
  };

  const userLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/");
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <Link href="/">
          <a className="brand-logo left">My Store</a>
        </Link>
        <ul id="nav-mobile" className="right">
          <li className={isActive("/cart")}>
            <Link href="/cart">
              <a>Cart</a>
            </Link>
          </li>
          {user && user?.role !== "user" && (
            <li className={isActive("/create")}>
              <Link href="/create">
                <a>Create</a>
              </Link>
            </li>
          )}
          {user ? (
            <>
              <li className={isActive("/account")}>
                <Link href="/account">
                  <a>Account</a>
                </Link>
              </li>
              <li>
                <button className="btn red" onClick={userLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={isActive("/login")}>
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </li>
              <li className={isActive("/signup")}>
                <Link href="/signup">
                  <a>Sign up</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
