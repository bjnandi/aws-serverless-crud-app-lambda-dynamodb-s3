import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  // Handle input change for both text and file fields
  const handleChange = (field) => (e) => {
    const value = field === "image" ? e.target.files[0] : e.target.value;
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      if (formData.image) data.append("image", formData.image);

      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("User added successfully!");
        setFormData({ name: "", image: null }); // Reset form
        navigate("/", { replace: true }); // Redirect to home
      } else {
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h3 className="text-center mb-4">Add New User</h3>
      <div className="mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange("name")}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          type="file"
          accept="image/*"
          onChange={handleChange("image")}
        />
      </div>
      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!formData.name || !formData.image} // Disable if inputs are empty
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddUser;
