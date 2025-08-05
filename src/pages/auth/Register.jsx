import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("officer");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

    
      await setDoc(doc(db, "users", user.uid), {
        email,
        department,
        role,
        createdAt: new Date(),
      });

      alert("Registered successfully!");
      navigate("/login");
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          className="input"
          placeholder="Department (e.g., NMC)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="officer">Officer</option>
          <option value="engineer">Engineer</option>
          <option value="contractor">Contractor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn">Register</button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-center w-full text-blue-500 hover:underline"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}
