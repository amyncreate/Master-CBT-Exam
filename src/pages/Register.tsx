import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const generateRegistrationId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `QZ-${timestamp}-${randomStr}`.toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    setIsLoading(true);

    try {
      const registrationId = generateRegistrationId();

      // Insert registration
      const { error: regError } = await supabase
        .from("student_registrations")
        .insert({
          full_name: fullName.trim(),
          registration_id: registrationId,
        });

      if (regError) throw regError;

      // Create admin notification
      await supabase
        .from("admin_notifications")
        .insert({
          type: "new_registration",
          message: `New student registered: ${fullName}`,
          registration_id: registrationId,
        });

      // Store in localStorage for quiz access
      localStorage.setItem("quizUser", JSON.stringify({
        fullName: fullName.trim(),
        registrationId,
      }));

      toast.success("Registration successful! Starting quiz...");
      navigate("/quiz");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Student Registration
          </CardTitle>
          <CardDescription className="text-center text-base">
            Enter your details to begin the quiz competition
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
              <p className="text-sm text-muted-foreground">
                Your unique registration ID will be generated automatically
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
                    Registering...
                  </>
                ) : (
                  "Register & Start Quiz"
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

export default Register;
