import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

type Contest = {
  _id: string;
  name: string;
  accessLevel: "vip" | "normal";
  status: "completed";
  prize: string;
  winningScore?: number;
};

export default function Prizes() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contests", "won"],
    queryFn: async () => {
      const res = await api.get("/contests/won");
      return res.data.data?.contests as Contest[];
    },
  });

  console.log("all prizes => ", data);

  if (isLoading)
    return <p className="text-muted-foreground">Loading your prizes...</p>;

  if (isError || !data)
    return <p className="text-red-600">Failed to load won contests.</p>;

  if (data.length === 0)
    return (
      <p className="text-muted-foreground">You haven’t won any contests yet.</p>
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((contest) => (
        <Card
          key={contest._id}
          className="hover:shadow-lg transition-all duration-200 border border-muted bg-gradient-to-br from-green-100/30 to-background backdrop-blur"
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
                variant="outline"
                className="rounded-full text-xs px-3 py-1"
              >
                Completed
              </Badge>

              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-xs px-3 py-1">
                🏆 You Won
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            <div className="flex justify-between mb-1">
              <span>Prize</span>
              <span className="font-semibold text-foreground">
                {contest.prize}
              </span>
            </div>
            {contest.winningScore !== undefined && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Winning Score</span>
                <span className="font-medium">{contest.winningScore}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
