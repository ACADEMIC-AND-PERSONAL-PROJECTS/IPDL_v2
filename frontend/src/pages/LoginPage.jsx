import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

const LoginPage = () => {

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await login(email, password);

            alert(`${data.message}`);
            console.log(data)
        } catch (err) {
            alert("Erreur");
            console.log(err);
        }
    }

  return (
    <>
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br/>
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
            <button type="submit">Se conneceter</button>
        </form>
    </>
  );
}

export default LoginPage