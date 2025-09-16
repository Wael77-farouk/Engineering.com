import React, { useContext, useState } from "react";
import { ShopContext } from "../Context/ShopContext";

const Profile = () => {
  const { userProjects, setToken, navigate } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState("projects");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">حسابي الشخصي</h1>

      {/* التبويبات */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 border-b-2 ${
            activeTab === "projects"
              ? "border-blue-800 text-blue-800 font-semibold"
              : "border-transparent"
          }`}
        >
          مشاريعي
        </button>
        <button
          onClick={() => setActiveTab("edit")}
          className={`px-4 py-2 border-b-2 ${
            activeTab === "edit"
              ? "border-blue-800 text-blue-800 font-semibold"
              : "border-transparent"
          }`}
        >
          تعديل الحساب
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-red-600 hover:underline"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* المحتوى حسب التبويب */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userProjects.length > 0 ? (
            userProjects.map((project) => (
              <div
                key={project._id}
                className="border rounded p-4 shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold mb-2">{project.title}</h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {project.description}
                </p>
                <button
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="mt-2 inline-block text-blue-700 hover:underline text-sm"
                >
                  عرض التفاصيل
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">
              لم تقم برفع أي مشروع بعد.
            </p>
          )}
        </div>
      )}

      {activeTab === "edit" && (
        <div className="text-center mt-10 text-gray-600">
          <p>ميزة تعديل الحساب قادمة قريبًا 🔧</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
