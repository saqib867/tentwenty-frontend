import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import api from "../../lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import useModalStore from "../../store/useModalStore";
import AddQuestionModal from "../../components/modals/AddQuestionModal";
import { Plus } from "lucide-react";
import { Switch } from "../../components/ui/switch";

type Question = {
  _id: string;
  questionText: string;
  type: "single-select" | "multi-select" | "true-false";
  options: string[];
  correctAnswers: string[];
};

type Contest = {
  _id: string;
  name: string;
  prize: string;
  accessLevel: "vip" | "normal";
  status: "ongoing" | "completed";
};

export default function ContestDetail() {
  const { id } = useParams();
  const { user } = useAuthStore((state) => state);
  const [ans, setans] = useState({
    contestId: "",
    answers: [{ questionId: "", selectedAnswers: [] }],
  });

  const { isOpen, modalType, openModal } = useModalStore((state) => state);

  const { data: contest } = useQuery({
    queryKey: ["contest", id],
    queryFn: async () => {
      const contest = await api.get(`/contests/${id}`);
      return contest.data?.data;
    },
  });

  const { data: questions } = useQuery({
    queryKey: ["questions", id],
    queryFn: async () => {
      const response = await api.get(`/question/${id}`);
      return response.data?.data?.questions;
    },
  });

  /**
   * Adds or updates an answer while respecting the question type.
   * For single‑select: one answer max (overwrites any previous choice)
   * For multi‑select : toggles the choice on/off
   */
  const handleSelectAnswer = (
    answer: string,
    questionId: string,
    questionType: string
  ) => {
    setans((prev: any) => {
      const idx = prev.answers.findIndex(
        (a: any) => a.questionId === questionId
      );
      const updated = [...prev.answers];

      if (idx !== -1) {
        const existing = updated[idx];

        if (questionType === "single-select") {
          // Overwrite any existing answer
          updated[idx] = {
            ...existing,
            selectedAnswers: [answer],
          };
        } else {
          // Multi-select: toggle answer in/out of the list
          const isSelected = existing.selectedAnswers.includes(answer);
          const newSelectedAnswers = isSelected
            ? existing.selectedAnswers.filter((a: string) => a !== answer) // remove if already selected
            : [...existing.selectedAnswers, answer]; // add if not selected

          updated[idx] = {
            ...existing,
            selectedAnswers: newSelectedAnswers,
          };
        }
      } else {
        // First time answering this question
        updated.push({
          questionId,
          questionType,
          selectedAnswers: [answer],
        });
      }

      return {
        ...prev,
        contestId: id!, // make sure `id` is set
        answers: updated,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const arr = [...ans.answers];
      arr.shift(); // removes first element

      console.log(arr);
      api.post("/submission/submit", {
        answers: arr,
        contestId: ans.contestId,
      });
    } catch (error) {
      console.log("error => ", error);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{contest?.name}</CardTitle>
          <Badge
            variant={contest?.accessLevel === "vip" ? "destructive" : "default"}
          >
            {contest?.accessLevel.toUpperCase()}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Prize: <strong>{contest?.prize}</strong>
          </p>
          <p>
            Status:{" "}
            {contest?.status === "ongoing" ? "🟢 Ongoing" : "⚪ Completed"}
          </p>
        </CardContent>
      </Card>

      {user?.role === "admin" && (
        <>
          <Button onClick={() => openModal("question-modal")}>
            Add Question <Plus />
          </Button>
          {isOpen && modalType == "question-modal" && (
            <AddQuestionModal contestId={id!} />
          )}
        </>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Questions</h2>
        {questions?.length === 0 ? (
          <p className="text-muted-foreground">No questions added yet.</p>
        ) : (
          questions?.map((q: any, i: number) => (
            <Card key={q._id}>
              <CardHeader>
                <p className="font-medium">
                  Q{i + 1}: {q.questionText}
                </p>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm text-muted-foreground">Type: {q.type}</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {q.options.map((opt: any, i: number) => (
                    <li
                      key={i}
                      className={`border-2 p-1 w-full text-center`}
                      onClick={() => handleSelectAnswer(opt, q?._id, q.type)}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
                {user?.role == "admin" && (
                  <p className="text-sm">
                    Correct: {q.correctAnswers.join(", ")}
                  </p>
                )}
                {/* "single-select", "multi-select", "true-false" */}
                {/* {user?.role !== "admin" && (
                  <p>{q.type == "true-false" && <Switch />}</p>
                )}
                {user?.role !== "admin" && (
                  <p>{q.type == "single-select" && <Switch />}</p>
                )}
                {user?.role !== "admin" && (
                  <p>{q.type == "true-false" && <Switch />}</p>
                )} */}
              </CardContent>
            </Card>
          ))
        )}
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}
