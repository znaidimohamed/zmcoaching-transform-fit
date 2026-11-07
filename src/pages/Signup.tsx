import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const result = await signup(fullName, email, password);

    if (result.success) {
      toast({
        title: "Compte créé",
        description: "Bienvenue sur ZM Coaching",
      });

      navigate("/user");
    } else {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <Card className="w-full max-w-md bg-white/[0.04] border-white/10 text-white backdrop-blur-xl rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-black">
            Créer un compte
          </CardTitle>

          <CardDescription className="text-center text-zinc-400">
            Rejoins ZM Coaching
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm mb-2 block">Nom complet</label>

              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-black/40 border-white/10"
              />
            </div>

            <div>
              <label className="text-sm mb-2 block">Email</label>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/40 border-white/10"
              />
            </div>

            <div>
              <label className="text-sm mb-2 block">Mot de passe</label>

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/40 border-white/10"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-red-600 hover:bg-red-700 py-6 font-black"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </Button>

            <p className="text-center text-sm text-zinc-400">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-red-500 hover:text-red-400 font-bold"
              >
                Connexion
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;