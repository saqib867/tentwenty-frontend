import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from "react-router-dom";
import AllContests from "../../components/dashboard/AllContests";
import InProgressContestsList from "../../components/dashboard/InProgress";
import Prizes from "../../components/dashboard/Prizes";

const SubmittedContests = () => {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-x-3">
        <span
          onClick={() => setParams({ tab: "all-contests" })}
          className={`p-2 rounded-md cursor-pointer ${
            tab == "all-contests" && "bg-blue-500 text-white"
          }`}
        >
          My Contests
        </span>
        <span
          onClick={() => setParams({ tab: "in-progress" })}
          className={`p-2 rounded-md cursor-pointer ${
            tab == "in-progress" && "bg-blue-500 text-white"
          } `}
        >
          In Progress
        </span>
        <span
          onClick={() => setParams({ tab: "all-prizes" })}
          className={`p-2 rounded-md cursor-pointer ${
            tab == "all-prizes" && "bg-blue-500 text-white"
          } `}
        >
          All Prizes
        </span>
      </div>

      {tab == "all-contests" && <AllContests />}
      {tab == "in-progress" && <InProgressContestsList />}
      {tab == "all-prizes" && <Prizes />}
    </div>
  );
};

export default SubmittedContests;
