import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('تسجيل الدخول');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!email || !password || (currentState === 'إنشاء حساب' && !name)) {
        return toast.warn('يرجى إدخال جميع البيانات');
      }

      if (currentState === 'إنشاء حساب') {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          setToken(response.data.token);
          toast.success('✅ تم إنشاء الحساب بنجاح');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          setToken(response.data.token);
          toast.success('✅ تم تسجيل الدخول بنجاح');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء العملية');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="text-3xl font-bold">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === 'إنشاء حساب' && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800 placeholder:text-gray-600"
          placeholder="الاسم الكامل"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800 placeholder:text-gray-600"
        placeholder="البريد الإلكتروني"
        required
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800 placeholder:text-gray-600"
        placeholder="كلمة المرور"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer text-black">هل نسيت كلمة المرور؟</p>
        {currentState === 'تسجيل الدخول' ? (
          <p
            onClick={() => setCurrentState('إنشاء حساب')}
            className="cursor-pointer text-black"
          >
            إنشاء حساب جديد
          </p>
        ) : (
          <p
            onClick={() => setCurrentState('تسجيل الدخول')}
            className="cursor-pointer text-black"
          >
            لدي حساب بالفعل
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'تسجيل الدخول' ? 'دخول' : 'إنشاء حساب'}
      </button>
    </form>
  );
};

export default Login;
