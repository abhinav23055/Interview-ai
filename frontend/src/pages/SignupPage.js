// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function SignupPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = (e) => {
//     e.preventDefault();
//     if (!email || !password || !confirmPassword) {
//       alert("⚠️ Please fill all fields");
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert("⚠️ Passwords do not match");
//       return;
//     }

//     // ✅ Simulate signup success (real DB integration comes later)
//     alert("✅ Signup successful! Please login.");
//     navigate("/");
//   };

//   return (
//     <div
//       style={{
//         fontFamily: "Arial, sans-serif",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #ffecd2, #fcb69f)",
//       }}
//     >
//       <div
//         style={{
//           background: "white",
//           padding: "40px",
//           borderRadius: "12px",
//           boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
//           width: "350px",
//           textAlign: "center",
//         }}
//       >
//         <h2 style={{ marginBottom: "20px", color: "#333" }}>📝 Sign Up</h2>
//         <form onSubmit={handleSignup}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "12px",
//               margin: "10px 0",
//               borderRadius: "6px",
//               border: "1px solid #ccc",
//             }}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "12px",
//               margin: "10px 0",
//               borderRadius: "6px",
//               border: "1px solid #ccc",
//             }}
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "12px",
//               margin: "10px 0",
//               borderRadius: "6px",
//               border: "1px solid #ccc",
//             }}
//           />
//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               padding: "12px",
//               marginTop: "15px",
//               background: "#28a745",
//               color: "white",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//             }}
//           >
//             Sign Up
//           </button>
//         </form>

//         <p style={{ marginTop: "15px" }}>
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/")}
//             style={{ color: "#007bff", cursor: "pointer" }}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default SignupPage;
