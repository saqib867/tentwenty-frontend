import { useQuery } from "@tanstack/react-query";
import React from "react";
import api from "../../lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";

type Contest = {
  _id: string;
  name: string;
  status: "ongoing" | "completed";
  hasWon?: boolean;
  accessLevel: "normal" | "vip";
  prize: string;
};

const AllContests = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contests", "participated"],
    queryFn: async () => {
      const res = await api.get("/contests/participated");
      return res.data.data?.contests as Contest[];
    },
  });

  const [params, setParams] = useSearchParams();
  const tab = params.get("tab");

  if (isLoading) {
    return <p className="text-muted-foreground">Loading contests...</p>;
  }

  if (isError || !data) {
    return (
      <p className="text-red-600">Failed to load participated contests.</p>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground">
        You haven't participated in any contests yet.
      </p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((contest) => (
        <Card
          key={contest._id}
          className="hover:shadow-lg transition-all duration-200 border border-muted bg-muted/40 backdrop-blur-sm"
        >
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="text-xl font-semibold text-foreground">
              {contest.name}
            </CardTitle>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={
                  contest.accessLevel === "vip" ? "destructive" : "secondary"
                }
                className="rounded-full text-xs px-3 py-1"
              >
                {contest.accessLevel.toUpperCase()}
              </Badge>

              <Badge
                variant={contest.status === "completed" ? "outline" : "default"}
                className="rounded-full text-xs px-3 py-1"
              >
                {contest.status === "completed" ? "✅ Completed" : "⏳ Ongoing"}
              </Badge>

              {contest.hasWon && (
                <Badge className="bg-green-600 hover:bg-green-700 text-white rounded-full text-xs px-3 py-1">
                  🏆 You Won
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Prize</span>
              <span className="font-semibold text-foreground">
                {contest.prize}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AllContests;
