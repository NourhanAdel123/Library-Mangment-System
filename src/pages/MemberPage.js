import React, { useEffect, useState } from "react";
import MembersList from "../components/MembersList";
import { getMembers, addMember, deleteMember } from "../utils/api";
import "./MemberPage.css";

function MemberPage() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(""); // For error messages

  // Fetch the members list
  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      setError("Failed to fetch members: " + error.message);
    }
  };

  // Load members when the component mounts
  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email || !newMember.phone) {
      setError("All fields are required.");
      return;
    }
    try {
      await addMember(newMember);
      setNewMember({ name: "", email: "", phone: "" });
      setShowForm(false);
      setError(""); // Clear any previous errors
      fetchMembers(); // Refresh the members list
    } catch (error) {
      setError("Error adding member: " + error.message);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await deleteMember(memberId);
      fetchMembers(); // Refresh the members list
    } catch (error) {
      setError("Error deleting member: " + error.message);
    }
  };

  return (
    <div className="members-page">
      <h2 className="members-title">Library Members</h2>
      <button
        className="toggle-form-btn"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Cancel" : "Add Member"}
      </button>
      {error && <div className="error-message">{error}</div>}
      {showForm && (
        <form className="add-member-form" onSubmit={handleAddMember}>
          <input
            type="text"
            placeholder="Name"
            value={newMember.name}
            onChange={(e) =>
              setNewMember({ ...newMember, name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={newMember.phone}
            onChange={(e) =>
              setNewMember({ ...newMember, phone: e.target.value })
            }
            required
          />
          <button type="submit" className="submit-btn">
            Add Member
          </button>
        </form>
      )}
      <MembersList members={members} onDeleteMember={handleDeleteMember} />
    </div>
  );
}

export default MemberPage;
