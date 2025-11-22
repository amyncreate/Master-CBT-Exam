import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle } from "lucide-react";

const ResultsPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold">Quiz Submitted!</CardTitle>
          <CardDescription className="text-base">
            Thank you for completing the quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Your submission is being processed</p>
                <p className="text-sm text-muted-foreground">
                  Our team is reviewing your answers
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Results available in 24 hours</p>
                <p className="text-sm text-muted-foreground">
                  You'll be able to check your results after the processing period
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              Save your registration details to check results later
            </p>
            
            <Button
              variant="quiz"
              className="w-full"
              onClick={() => navigate("/check-results")}
            >
              Check Results
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPending;
