import React from "react";
import "./MemberItem.css";

function MemberItem({ member, onDeleteMember }) {
  return (
    <div className="member-item">
      <i className="icon">👤</i>
      <p>
        <span className="label">Name: </span>
        {member.name}
      </p>
      <p>
        <span className="label">Email: </span>
        {member.email}
      </p>
      <p>
        <span className="label">Phone: </span>
        {member.phone}
      </p>
      <button onClick={() => onDeleteMember(member.id)}>Delete</button>
    </div>
  );
}

export default MemberItem;
