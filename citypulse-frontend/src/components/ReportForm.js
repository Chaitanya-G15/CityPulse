import React, { useState } from "react";

const ReportForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    roadType: "Highway",
    roadNo: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Report:", formData);

    // Pass to parent (later API call)
    if (onSubmit) {
      onSubmit(formData);
    }

    alert("Report submitted successfully!");
    setFormData({
      country: "",
      state: "",
      city: "",
      roadType: "Highway",
      roadNo: "",
      description: "",
      file: null,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <h2>Report an Issue</h2>

      <label>Country: </label>
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
      />
      <br />

      <label>State: </label>
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        required
      />
      <br />

      <label>City: </label>
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
      />
      <br />

      <label>Road Type: </label>
      <select
        name="roadType"
        value={formData.roadType}
        onChange={handleChange}
      >
        <option value="Highway">Highway</option>
        <option value="Main Road">Main Road</option>
        <option value="Street">Street</option>
        <option value="Lane">Lane</option>
      </select>
      <br />

      <label>Road No: </label>
      <input
        type="text"
        name="roadNo"
        value={formData.roadNo}
        onChange={handleChange}
      />
      <br />

      <label>Description: </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <br />

      <label>Upload File (Image/Video): </label>
      <input type="file" name="file" accept="image/*,video/*" onChange={handleChange} />
      <br />

      <button type="submit">Submit Report</button>
    </form>
  );
};

export default ReportForm;
