import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Award, Calendar, User, Hash } from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fullName, registrationId, score, totalQuestions, submittedAt } = location.state || {};

  if (!location.state) {
    navigate("/check-results");
    return null;
  }

  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassing = percentage >= 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
            isPassing ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <Trophy className={`w-10 h-10 ${isPassing ? 'text-green-600' : 'text-orange-600'}`} />
          </div>
          <CardTitle className="text-4xl font-bold">
            {isPassing ? 'Congratulations!' : 'Quiz Completed'}
          </CardTitle>
          <CardDescription className="text-lg">
            {isPassing 
              ? 'You have successfully passed the quiz!'
              : 'Thank you for participating in the quiz'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center">
            <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
              {percentage}%
            </div>
            <div className="text-2xl font-semibold mb-1">
              {score} out of {totalQuestions}
            </div>
            <div className="text-muted-foreground">
              Correct Answers
            </div>
          </div>

          {/* Student Details */}
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <User className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Student Name</div>
                <div className="font-medium">{fullName}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Hash className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Registration ID</div>
                <div className="font-mono font-medium">{registrationId}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Submitted On</div>
                <div className="font-medium">
                  {new Date(submittedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Badge */}
          {isPassing && (
            <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">
                Excellent Performance!
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              variant="default"
              className="w-full h-12 text-base"
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

export default Results;
