import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

type Contest = {
  _id: string;
  name: string;
  status: "ongoing" | "completed";
  accessLevel: "vip" | "normal";
  prize: string;
};

export default function InProgressContestsList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contests", "in-progress"],
    queryFn: async () => {
      const res = await api.get("/contests/in-progress");
      return res.data?.data.contests as Contest[];
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading contests...</p>;
  }

  if (isError || !data) {
    return <p className="text-red-600">Failed to load in-progress contests.</p>;
  }

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground">No in-progress contests found.</p>
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
                variant="default"
                className="rounded-full text-xs px-3 py-1"
              >
                ⏳ In Progress
              </Badge>
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
}
