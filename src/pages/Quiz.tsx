import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  order_index: number;
}

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is registered
    const userData = localStorage.getItem("quizUser");
    if (!userData) {
      toast.error("Please register first");
      navigate("/register");
      return;
    }

    loadQuestions();
  }, [navigate]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .order("order_index");

      if (error) throw error;
      
      // Transform data to match Question type
      const transformedData: Question[] = (data || []).map(q => ({
        id: q.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options as string[] : JSON.parse(q.options as string),
        correct_answer: q.correct_answer,
        order_index: q.order_index,
      }));
      
      setQuestions(transformedData);
    } catch (error: any) {
      console.error("Error loading questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = JSON.parse(localStorage.getItem("quizUser") || "{}");
      
      // Calculate score
      let score = 0;
      questions.forEach(q => {
        if (answers[q.id] === q.correct_answer) {
          score++;
        }
      });

      // Calculate results visible time (24 hours from now)
      const resultsVisibleAt = new Date();
      resultsVisibleAt.setHours(resultsVisibleAt.getHours() + 24);

      // Submit quiz
      const { error: submitError } = await supabase
        .from("quiz_submissions")
        .insert({
          registration_id: userData.registrationId,
          full_name: userData.fullName,
          answers: answers,
          score,
          total_questions: questions.length,
          results_visible_at: resultsVisibleAt.toISOString(),
          status: 'pending',
        });

      if (submitError) throw submitError;

      // Create admin notification
      await supabase
        .from("admin_notifications")
        .insert({
          type: "quiz_submitted",
          message: `${userData.fullName} submitted quiz - Score: ${score}/${questions.length}`,
          registration_id: userData.registrationId,
        });

      toast.success("Quiz submitted successfully!");
      navigate("/results-pending");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
            <CardDescription>Please contact the administrator</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 py-8">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Quiz Competition</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Question {currentQuestion + 1} of {questions.length}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              Question {currentQuestion + 1}
            </CardTitle>
            <CardDescription className="text-lg text-foreground pt-2">
              {currentQ.question}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            Previous
          </Button>
          
          {currentQuestion === questions.length - 1 ? (
            <Button
              variant="quiz"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleNext}
              className="flex-1"
            >
              Next
            </Button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Answered: {Object.keys(answers).length} / {questions.length}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
