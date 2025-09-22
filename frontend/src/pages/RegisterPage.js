// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:5000/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("✅ Registration successful! Please login.");
//         navigate("/");
//       } else {
//         alert("❌ " + data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={{ padding: "10px", margin: "10px" }}
//         />
//         <br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={{ padding: "10px", margin: "10px" }}
//         />
//         <br />
//         <button type="submit" style={{ padding: "10px 20px" }}>
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }

// export default RegisterPage;
