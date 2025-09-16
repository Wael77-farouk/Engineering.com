import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState(null); // ✅ رقم الهاتف المستخرج

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/projects/${id}`);
        const projectData = response.data.data || response.data;
        setProject(projectData);

        // ✅ استخراج رقم الهاتف من الوصف إن وُجد
        const match = projectData.description?.match(/(?:\+2|002)?01[0-2,5][0-9]{8}/);
        if (match) {
          const cleaned = match[0].replace(/^\+2|^002/, ""); // إزالة +2 أو 002
          setPhone(cleaned);
        } else {
          setPhone(null);
        }

        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("المشروع غير موجود");
        } else {
          setError("حدث خطأ في تحميل المشروع");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id && backendUrl) {
      fetchProject();
    }
  }, [id, backendUrl]);

  const getEngineerName = () => {
    if (project?.engineerName) return project.engineerName;
    if (project?.engineerId?.name) return project.engineerId.name;
    if (project?.engineer?.name) return project.engineer.name;
    return "غير محدد";
  };

  const getEngineerEmail = () => {
    if (project?.engineerEmail) return project.engineerEmail;
    if (project?.engineerId?.email) return project.engineerId.email;
    if (project?.engineer?.email) return project.engineer.email;
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل المشروع...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">خطأ!</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      {project.image && (
        <div className="mb-6">
          <img
            src={project.image}
            alt={project.title || "صورة المشروع"}
            className="rounded-lg shadow-lg mb-4 w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold text-blue-800 mb-4">
        {project.title || "عنوان المشروع"}
      </h1>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">👨‍💼</span>
          <p className="text-lg font-semibold text-gray-700">
            المهندس:{" "}
            <span className="text-blue-700 font-bold">{getEngineerName()}</span>
          </p>
        </div>
        {getEngineerEmail() && (
          <div className="flex items-center gap-2">
            <span className="text-lg">📧</span>
            <p className="text-sm text-gray-600">
              البريد الإلكتروني: {getEngineerEmail()}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-500 mb-1">التخصص</p>
          <p className="font-medium text-blue-700 text-lg">
            {project.category || "غير محدد"}
          </p>
        </div>

        {project.date && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500 mb-1">تاريخ الإنشاء</p>
            <p className="font-medium text-gray-700 text-lg">
              {new Date(project.date).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">وصف المشروع</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="leading-8 text-gray-700 text-lg whitespace-pre-wrap">
            {project.description || "لا يوجد وصف متاح للمشروع"}
          </p>
        </div>

        {/* ✅ زر الواتساب */}
        {phone && (
          <a
            href={`https://wa.me/2${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            📞 تواصل عبر واتساب
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
        {project.file && (
          <a
            href={project.file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors shadow-md"
          >
            <span className="text-xl">📄</span>
            تحميل ملف المشروع
          </a>
        )}

        <button
          className="flex items-center gap-2 text-blue-600 px-6 py-3 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          onClick={() => navigate(-1)}
        >
          <span className="text-xl">←</span>
          الرجوع للصفحة السابقة
        </button>

        <button
          className="flex items-center gap-2 text-green-600 px-6 py-3 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
          onClick={() => navigate("/")}
        >
          <span className="text-xl">🏠</span>
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
