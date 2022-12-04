import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPost from "./pages/AddPost";
import FindConnections from "./components/FindConnections";
import PrivateRoutes from "./components/PrivateRoutes";
import { AuthProvider } from "./context/AuthProvider";
import UserProfilePage from "./components/users/UserProfilePage";
import ConnectionsProvider from "./context/ConnectionsProvider";
import TheNetWorkProvider from "./context/TheNetWorkProvider";
import UserSinglePost from "./components/users/UserSinglePost";
import EditProfile from "./pages/EditProfile";
import ViewAllPost from "./pages/ViewAllPost";

function App() {
  return (
    <AuthProvider>
      <TheNetWorkProvider>
        <ConnectionsProvider>
          <Router>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-post" element={<AddPost />} />
                <Route path="/user-profile" element={<UserProfilePage />} />
                <Route path="/view-all-posts" element={<ViewAllPost />} />
                <Route
                  path="/single-post-detail"
                  element={<UserSinglePost />}
                />
                <Route path="/find-connections" element={<FindConnections />} />
                <Route path="/edit-profile" element={<EditProfile />} />
              </Route>
              <Route path="*" element={<p>There's nothing here: 404!</p>} />
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
          <ToastContainer position="top-center" theme="colored" />
        </ConnectionsProvider>
      </TheNetWorkProvider>
    </AuthProvider>
  );
}

export default App;
