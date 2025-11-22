import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";

const CheckResults = () => {
  const [fullName, setFullName] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !registrationId.trim()) {
      toast.error("Please enter both your name and registration ID");
      return;
    }

    setIsLoading(true);

    try {
      // First, verify registration exists
      const { data: registration, error: regError } = await supabase
        .from("student_registrations")
        .select("*")
        .eq("registration_id", registrationId.trim())
        .eq("full_name", fullName.trim())
        .single();

      if (regError || !registration) {
        toast.error("Invalid name or registration ID. Please check your details.");
        setIsLoading(false);
        return;
      }

      // Call the function to update result statuses
      await supabase.rpc("update_result_status");

      // Check for quiz submission
      const { data: submission, error: subError } = await supabase
        .from("quiz_submissions")
        .select("*")
        .eq("registration_id", registrationId.trim())
        .eq("full_name", fullName.trim())
        .order("submitted_at", { ascending: false })
        .limit(1)
        .single();

      if (subError || !submission) {
        toast.error("No quiz submission found. Please complete the quiz first.");
        setIsLoading(false);
        return;
      }

      // Check if results are available
      if (submission.status === 'pending') {
        const resultsDate = new Date(submission.results_visible_at);
        toast.info(`Results will be available on ${resultsDate.toLocaleString()}`);
        setIsLoading(false);
        return;
      }

      // Navigate to results page with data
      navigate("/results", {
        state: {
          fullName: submission.full_name,
          registrationId: submission.registration_id,
          score: submission.score,
          totalQuestions: submission.total_questions,
          submittedAt: submission.submitted_at,
        },
      });
    } catch (error: any) {
      console.error("Error checking results:", error);
      toast.error("Failed to check results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">Check Your Results</CardTitle>
          <CardDescription className="text-center text-base">
            Enter your details to view your quiz results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationId" className="text-base">Registration ID</Label>
              <Input
                id="registrationId"
                type="text"
                placeholder="Enter your registration ID"
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
                disabled={isLoading}
                className="h-12 text-base font-mono"
                required
              />
              <p className="text-sm text-muted-foreground">
                Use the ID provided during registration
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-base"
                variant="quiz"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "View Results"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base"
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Back to Home
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckResults;
