import Link from "next/link";
import React from "react";

const ProtectedRoute = () => {
  return (
    <div>
      <h1>You are not logged in.</h1>
      <p>
        Please <Link href="/login">login</Link> to access the app.
      </p>
    </div>
  );
};

export default ProtectedRoute;
