import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract `id` directly from the route params

  const [data, setData] = useState({ name: "", image: "" });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${id}`);
        if (response.ok) {
          const userData = await response.json();
          setData({ name: userData.name, image: "" }); // Reset image to empty as it's a file upload
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  // Handle form field changes
  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.image) formData.append("image", data.image);

      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setData({ name: "", image: "" });
        navigate("/", { replace: true });
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2 className="text-center">Edit User</h2>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          id="name"
          className="form-control"
          type="text"
          value={data.name}
          onChange={handleChange("name")}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          Upload Image
        </label>
        <input
          id="image"
          className="form-control"
          type="file"
          accept="image/*"
          onChange={handleChange("image")}
        />
      </div>
      <div className="text-center">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
};

export default EditUser;
