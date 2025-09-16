// ShopContext.jsx
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const backendUrl = "http://localhost:4000"; // ✏️ غير الرابط هنا حسب خادمك
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userProjects, setUserProjects] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // حفظ الـ token في localStorage عند تغييره
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // إعداد axios interceptor لإضافة الـ token تلقائياً
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // الـ token منتهي الصلاحية
          setToken("");
          localStorage.removeItem("token");
          toast.error("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // تنظيف الـ interceptors عند unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, navigate]);

  // حساب عدد العناصر في السلة
  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, val) => acc + val, 0);
  };

  // جلب مشاريع المستخدم
  const fetchUserProjects = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/projects/user-projects`);
      if (response.data.success) {
        setUserProjects(response.data.data);
      }
    } catch (err) {
      console.error("خطأ في جلب المشاريع:", err);
      toast.error("فشل في جلب المشاريع");
    } finally {
      setLoading(false);
    }
  };

  // جلب جميع المنتجات
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error("خطأ في جلب المنتجات:", err);
      toast.error("فشل في جلب المنتجات");
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });
      
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("تم تسجيل الدخول بنجاح");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (err) {
      console.error("خطأ في تسجيل الدخول:", err);
      toast.error(err.response?.data?.message || "فشل في تسجيل الدخول");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    setToken("");
    setUserProjects([]);
    setCartItems({});
    localStorage.removeItem("token");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/login");
  };

  // إضافة منتج للسلة
  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("يرجى اختيار المقاس");
      return;
    }

    let cartData = structuredClone(cartItems);
    
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    toast.success("تمت إضافة المنتج للسلة");
  };

  // تحديث كمية المنتج في السلة
  const updateQuantity = (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);
  };

  // حساب المجموع الإجمالي
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.error("خطأ في حساب المجموع:", error);
        }
      }
    }
    return totalAmount;
  };

  // جلب البيانات عند تحميل الـ token
  useEffect(() => {
    if (token) {
      fetchUserProjects();
    }
    fetchProducts();
  }, [token]);

  // القيم التي سيتم تمريرها لجميع المكونات
  const contextValue = {
    backendUrl,
    token,
    setToken,
    navigate,
    userProjects,
    setUserProjects,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    products,
    setProducts,
    loading,
    setLoading,
    fetchUserProjects,
    fetchProducts,
    login,
    logout,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;