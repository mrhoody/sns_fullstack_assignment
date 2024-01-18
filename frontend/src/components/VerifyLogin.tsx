import React from "react";

const ProtectedRoute = () => {
  return (
    <div>
      <h1>You are not logged in.</h1>
      <p>
        Please <a href="/login">login</a> to access the app.
      </p>
    </div>
  );
};

export default ProtectedRoute;
