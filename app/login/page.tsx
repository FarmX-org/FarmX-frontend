// app/login/page.tsx
"use client";
import Login from "@/components/auth/Login";
const LoginPage = ({ setToken }: { setToken: (token: string) => void }) => {
  return (
    <div>
      <Login setToken={setToken} />
    </div>
  );
};

export default LoginPage;
