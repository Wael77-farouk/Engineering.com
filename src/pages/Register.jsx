import React from 'react'

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🧪 هنا ممكن تبعت بيانات التسجيل إلى backend
    if (form.name && form.email && form.password) {
      localStorage.setItem("token", "new_token_here");
      navigate("/"); // يرجّع المستخدم للصفحة الرئيسية
    } else {
      alert("يرجى تعبئة جميع الحقول");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          إنشاء حساب جديد
        </h2>

        <label className="block mb-2">الاسم الكامل</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <label className="block mb-2">البريد الإلكتروني</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <label className="block mb-2">كلمة المرور</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-6"
          required
        />

        <button
          type="submit"
          className="bg-blue-800 text-white w-full py-2 rounded hover:bg-blue-900"
        >
          تسجيل
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-blue-700 hover:underline">
            سجل الدخول
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

