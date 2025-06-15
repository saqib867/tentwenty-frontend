import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Signup from "../pages/auth/Signup";
import Home from "../pages/Home";
import CreateContest from "../pages/contests/CreateContests";
import ContestsList from "../pages/contests/ContestList";
import ContestDetail from "../pages/contests/ContestDetails";
import Layout from "../layout/layout";
import Login from "../pages/auth/login";
import SubmittedContests from "../pages/dashboard/SubmittedContests";
import Leaderboard from "../pages/dashboard/LeaderBoard";

// Usage: Wrap components with <Suspense>

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create-contest" element={<CreateContest />} />
        <Route path="/contests" element={<ContestsList />} />
        <Route path="/contests/:id" element={<ContestDetail />} />
        <Route path="/dashboard" element={<SubmittedContests />} />
        <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
      </Route>
    </>
  )
);
