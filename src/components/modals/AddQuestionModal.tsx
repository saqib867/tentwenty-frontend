import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useModalStore from "../../store/useModalStore";

type Props = {
  contestId: string;
};

const defaultOptionFields = ["", "", "", ""];

export default function AddQuestionModal({ contestId }: Props) {
  const [type, setType] = useState<
    "single-select" | "multi-select" | "true-false"
  >("single-select");

  const { closeModal, isOpen } = useModalStore((state) => state);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(defaultOptionFields);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        contestId,
        type,
        questionText,
        options: type === "true-false" ? ["True", "False"] : options,
        correctAnswers,
      };
      await api.post("/question", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", contestId] });
      closeModal();
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to add question");
    },
  });

  const resetForm = () => {
    setType("single-select");
    setQuestionText("");
    setOptions(defaultOptionFields);
    setCorrectAnswers([]);
    setError("");
  };

  const handleOptionChange = (val: string, index: number) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const toggleCorrectAnswer = (val: string) => {
    type == "single-select"
      ? setCorrectAnswers([val])
      : setCorrectAnswers((prev) =>
          prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
        );
  };

  const isSelected = (val: string) => correctAnswers.includes(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // minimal validation
    if (!questionText.trim()) return setError("Question text is required");
    if (
      (type === "single-select" || type === "multi-select") &&
      options.some((o) => !o.trim())
    )
      return setError("All options are required");
    if (correctAnswers.length === 0)
      return setError("At least one correct answer is required");

    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Question Type</Label>
            <Select
              value={type}
              onValueChange={(val) => {
                setType(val as typeof type);
                setCorrectAnswers([]);
                if (val === "true-false") {
                  setOptions(["True", "False"]);
                } else {
                  setOptions(defaultOptionFields);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-select">Single Select</SelectItem>
                <SelectItem value="multi-select">Multi Select</SelectItem>
                <SelectItem value="true-false">True / False</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Question</Label>
            <Textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          {(type === "single-select" || type === "multi-select") && (
            <div className="space-y-1">
              <Label>Options</Label>
              <div className="space-y-2 mt-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={opt}
                      placeholder={`Option ${i + 1}`}
                      onChange={(e) => handleOptionChange(e.target.value, i)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant={isSelected(opt) ? "default" : "outline"}
                      onClick={() => toggleCorrectAnswer(opt)}
                    >
                      {isSelected(opt) ? "✓ Correct" : "Mark Correct"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === "true-false" && (
            <div className="space-y-1">
              <Label>Correct Answer</Label>
              <div className="flex gap-4 mt-2">
                {["True", "False"].map((val) => (
                  <Button
                    key={val}
                    type="button"
                    variant={isSelected(val) ? "default" : "outline"}
                    onClick={() => setCorrectAnswers([val])}
                  >
                    {val}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Adding..." : "Add Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
