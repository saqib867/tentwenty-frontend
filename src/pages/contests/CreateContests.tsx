import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function CreateContest() {
  const navigate = useNavigate();
  const { user } = useAuthStore((state) => state); // ensure admin role on render
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    prize: "",
    accessLevel: "normal" as "normal" | "vip",
    startTime: "",
    endTime: "",
  });

  // Prevent non‑admins from seeing / using this page (extra guard)
  //   if (user?.role !== "admin") {
  //     return (
  //       <div className="flex items-center justify-center h-screen">
  //         <p className="text-lg font-semibold text-red-600">
  //           Access denied – admin only
  //         </p>
  //       </div>
  //     );
  //   }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const createContest = async () => {
    const res = await api.post("/contests", form);
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: createContest,
    onSuccess: () => {
      toast.success("Contest created successfully");
      setForm({
        accessLevel: "normal",
        description: "",
        endTime: "",
        name: "",
        prize: "",
        startTime: "",
      });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to create contest");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Contest</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name */}
            <div>
              <Label htmlFor="name">Contest Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                className="w-full border-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            {/* prize */}
            <div>
              <Label htmlFor="prize">Prize</Label>
              <Input
                id="prize"
                name="prize"
                value={form.prize}
                onChange={handleChange}
                required
              />
            </div>

            {/* access level — updated block */}
            <div className="flex flex-col gap-y-2">
              <div>
                <Label htmlFor="accessLevel">
                  Who can access this contest?
                </Label>
                <Select
                  value={form.accessLevel}
                  onValueChange={(val) =>
                    setForm({ ...form, accessLevel: val as "normal" | "vip" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Users</SelectItem>
                    <SelectItem value="vip">VIP Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-start text-muted-foreground mt-1">
                <span className="font-medium">Normal:</span> accessible by
                signed‑in normal and VIP users.
                <br />
                <span className="font-medium">VIP:</span> accessible only by VIP
                users and admins.
              </p>
            </div>

            {/* date range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, -8)}
                  required
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  disabled={!form.startTime}
                  min={
                    form.startTime &&
                    new Date(form.startTime).toISOString().slice(0, -8)
                  }
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* error + submit */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Contest"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
