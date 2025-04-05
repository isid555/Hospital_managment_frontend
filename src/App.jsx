import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout>
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        </Layout>
                    }
                />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/register" element={<Layout><Register /></Layout>} />
                <Route
                    path="/dashboard"
                    element={
                        <Layout>
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        </Layout>
                    }
                />
            </Routes>
            <Toaster position="top-right" />
        </Router>

    );
}

export default App;
