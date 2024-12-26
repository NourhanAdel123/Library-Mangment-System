import React from "react";
import MemberItem from "./MemberItem"; // Assuming you will create a `MemberItem` component

function MembersList({ members, onDeleteMember }) {
  return (
    <div>
      {members.map((member) => (
        <MemberItem
          key={member.id}
          member={member}
          onDeleteMember={onDeleteMember}
        />
      ))}
    </div>
  );
}

export default MembersList;
