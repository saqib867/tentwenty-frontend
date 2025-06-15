import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";

type Contest = {
  _id: string;
  name: string;
  description?: string;
  prize: string;
  accessLevel: "vip" | "normal";
  status: "ongoing" | "completed";
  hasParticipated: boolean;
};

export default function ContestsList() {
  const { token, user } = useAuthStore((state) => state);

  let apicall = token
    ? api.get("/contests")
    : axios.get(`http://localhost:3000/api/contests/home`);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contests"],
    queryFn: async () => {
      const res = await apicall;
      return res.data?.data?.contests as Contest[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-red-600">Failed to load contests.</p>;
  }

  if (data.length === 0) {
    return <p className="text-muted-foreground">No contests available.</p>;
  }

  const handleUpdateContest = async (id: string) => {
    try {
      const response = await api.post(`/submission/contests/${id}/start`);
      console.log("response => ", response.data?.data);
    } catch (error) {
      console.log("error=>", error);
    }
  };

  console.log("all contest => ", data);
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((contest) => (
        <Card key={contest._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{contest.name}</CardTitle>
              <Badge
                variant={
                  contest.accessLevel === "vip" ? "destructive" : "default"
                }
              >
                {contest.accessLevel.toUpperCase()}
              </Badge>
              {contest.hasParticipated && (
                <span className="text-xs text-purple-700">
                  Already participated
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Prize: <span className="font-medium">{contest.prize}</span>
            </p>
            <p
              className={`text-xs font-semibold ${
                contest.status === "ongoing"
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {contest.status === "ongoing" ? " Ongoing" : "⚪ Completed"}
            </p>

            {token && !contest.hasParticipated && user?.role !== "admin" && (
              <Link
                onClick={() => handleUpdateContest(contest._id)}
                to={`/contests/${contest._id}`}
              >
                <Button className="w-full mt-2" variant="outline">
                  View Contest
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
