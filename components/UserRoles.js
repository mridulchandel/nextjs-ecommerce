import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

import baseUrl from "../helpers/baseUrl";
import styles from "../styles/UserRoles.module.css";

const UserRoles = () => {
  const { tooltip, tooltiptext } = styles;

  const [users, setUsers] = useState([]);

  const { token } = parseCookies();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch(`${baseUrl}users`, {
      headers: {
        Authorization: token,
      },
    });
    const res2 = await res.json();
    if (!res2.error) {
      setUsers(res2);
    }
  };

  const handleRole = async (_id, role) => {
    const res = await fetch(`${baseUrl}users`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
        role,
      }),
    });

    const res2 = await res.json();
    if (!res2.errors) {
      const modifiedUsers = users.map((user) => {
        if (user._id === res2._id) {
          return res2;
        }
        return user;
      });
      setUsers(modifiedUsers);
    }
  };
  return (
    <>
      <h1>User Roles</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td
                  onClick={() => handleRole(user._id, user.role)}
                  className={tooltip}
                >
                  <span className={tooltiptext}>
                    Toggle to {user.role === "user" ? "admin" : "user"}
                  </span>
                  {user.role}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default UserRoles;
