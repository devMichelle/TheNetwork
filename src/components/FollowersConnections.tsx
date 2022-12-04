import React from "react";

type followersType = { name: string; avatar: string };

const FollowersConnections = (
  followers:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined
) => {
  return (
    <div className="flex gap-5 mt-5">
      {followers}
      <div className="avatar placeholder">
        <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
          <span>MX</span>
        </div>
      </div>
      <div>
        <h3>Jane doe</h3>
      </div>
    </div>
  );
};

export default FollowersConnections;
