import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

type LeaderboardEntry = {
  userId: string;
  name: string;
  email: string;
  totalScore: number;
};

export default function Leaderboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await api.get("/submission/leaderboard");
      return res.data?.data?.leaderboard as LeaderboardEntry[];
    },
  });

  if (isLoading) {
    return (
      <Card className="w-full  mx-auto mt-8">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-red-600 text-center mt-10">
        Failed to load leaderboard.
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm sm:text-base">
          <thead className="text-muted-foreground border-b">
            <tr>
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2 hidden sm:table-cell">Email</th>
              <th className="text-right py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr
                key={user.userId}
                className={`border-b p-2 last:border-none ${
                  index === 0
                    ? "bg-yellow-50 font-bold"
                    : index === 1
                    ? "bg-gray-50"
                    : index === 2
                    ? "bg-orange-50"
                    : ""
                }`}
              >
                <td className="py-3">{index + 1}</td>
                <td className="py-3">{user.name}</td>
                <td className="py-3 hidden sm:table-cell text-muted-foreground">
                  {user.email}
                </td>
                <td className="py-3 text-right font-medium text-foreground">
                  {user.totalScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
