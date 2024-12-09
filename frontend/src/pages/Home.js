import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete user with ID ${id}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/user/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        alert(`User with ID ${id} deleted successfully`);
      } else {
        console.error(`Failed to delete user with ID ${id}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Render loading state or user cards
  if (loading) {
    return <h3 className="text-center">Loading...</h3>;
  }

  if (!users.length) {
    return <h3 className="text-center">No users found.</h3>;
  }

  return (
    <div className="row justify-content-center">
      <h2 className="text-center mb-4">Our User Profiles</h2>
      {users.map((user) => (
        <div className="card me-3 mt-2 p-0" key={user.id} style={{ width: "18rem" }}>
          <img
            src={`https://crud-app-image-12345.s3.us-east-1.amazonaws.com/${user.image}`}
            alt={`${user.name}`}
            className="card-img-top"
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title text-center">{user.name}</h5>
            <div className="d-flex justify-content-between">
              <Link
                to={`/edit/${user.id}`}
                className="btn btn-primary btn-sm"
              >
                Edit
              </Link>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
