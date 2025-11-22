import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Trophy, Users } from "lucide-react";
import heroImage from "@/assets/hero-quiz.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Welcome to Quiz Competition
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Test your knowledge, challenge yourself, and compete with others in our comprehensive quiz platform. 
              Get instant feedback and track your progress over time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                variant="quiz" 
                size="lg"
                onClick={() => navigate("/register")}
                className="text-lg"
              >
                Start Quiz Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/check-results")}
                className="text-lg"
              >
                Check Results
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Compete & Win</CardTitle>
              <CardDescription>
                Challenge yourself with carefully crafted questions and see how you rank against other participants
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-secondary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Learn & Grow</CardTitle>
              <CardDescription>
                Enhance your knowledge across various subjects with our comprehensive quiz database
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Monitor your performance and improvement with detailed results and analytics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-xl">Register</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Enter your full name and receive a unique registration ID to track your progress
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <CardTitle className="text-xl">Take the Quiz</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Answer multiple-choice questions at your own pace and submit when ready
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <CardTitle className="text-xl">Get Results</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Results will be available within 24 hours. Check back using your name and registration ID
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Admin Link */}
      <section className="container mx-auto px-4 py-8 text-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/login")}
          className="text-muted-foreground hover:text-foreground"
        >
          Admin Login
        </Button>
      </section>
    </div>
  );
};

export default Welcome;
