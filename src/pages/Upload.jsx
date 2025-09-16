import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../Context/ShopContext";

const Upload = () => {
  const navigate = useNavigate();
  const context = useContext(ShopContext);

  if (!context) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-red-50 border border-red-200 rounded mt-8">
        <h2 className="text-2xl font-bold text-red-800 mb-4">خطأ في النظام</h2>
        <p className="text-red-600">
          لا يمكن الوصول إلى بيانات التطبيق. يرجى التأكد من أن المكون محاط بـ ShopContextProvider.
        </p>
      </div>
    );
  }

  const { token, backendUrl } = context;

  const [project, setProject] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
    cadFile: null,
  });

  const [uploading, setUploading] = useState(false);

  if (!token) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded mt-8">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">تسجيل الدخول مطلوب</h2>
        <p className="text-yellow-600 mb-4">
          يجب تسجيل الدخول أولاً لتتمكن من رفع مشروع جديد.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  // فحص نوع الملف
  const isValidFileType = (file, allowedTypes) => {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(fileExtension);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      const file = files[0];
      if (file) {
        const allowedImageTypes = ['.jpg', '.jpeg', '.png', '.webp'];
        if (!isValidFileType(file, allowedImageTypes)) {
          toast.error("نوع الصورة غير مدعوم. الأنواع المدعومة: JPG, PNG, WEBP");
          e.target.value = "";
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error("حجم الصورة كبير جداً. يجب أن يكون أقل من 10MB");
          e.target.value = "";
          return;
        }
      }
      setProject({ ...project, [name]: file });
    } else if (name === "cadFile") {
      const file = files[0];
      if (file) {
        const allowedCADTypes = ['.dwg', '.dxf', '.pdf'];
        if (!isValidFileType(file, allowedCADTypes)) {
          toast.error("نوع ملف CAD غير مدعوم. الأنواع المدعومة: DWG, DXF, PDF");
          e.target.value = "";
          return;
        }
        if (file.size > 50 * 1024 * 1024) {
          toast.error("حجم ملف CAD كبير جداً. يجب أن يكون أقل من 50MB");
          e.target.value = "";
          return;
        }
      }
      setProject({ ...project, [name]: file });
    } else {
      setProject({ ...project, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!project.title || !project.category || !project.description || !project.image || !project.cadFile) {
      toast.error("يرجى ملء جميع الحقول المطلوبة ❌");
      return;
    }

    // تحقق إضافي من نوع ملف CAD
    const cadFileExtension = '.' + project.cadFile.name.split('.').pop().toLowerCase();
    if (!['.dwg', '.dxf', '.pdf'].includes(cadFileExtension)) {
      toast.error("نوع ملف CAD غير مدعوم. الأنواع المدعومة: DWG, DXF, PDF");
      return;
    }

    const formData = new FormData();
    formData.append("title", project.title);
    formData.append("category", project.category);
    formData.append("description", project.description);
    formData.append("image", project.image);
    formData.append("file", project.cadFile);

    try {
      setUploading(true);
      
      // إضافة timeout أطول للملفات الكبيرة
      const timeoutDuration = project.cadFile.size > 10 * 1024 * 1024 ? 300000 : 120000; // 5 دقائق للملفات الكبيرة
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

      const res = await fetch(`${backendUrl}/api/projects/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        toast.success("✅ تم رفع المشروع بنجاح! في انتظار مراجعة الأدمن");
        setProject({
          title: "",
          category: "",
          description: "",
          image: null,
          cadFile: null,
        });
        document.getElementById("image-input").value = "";
        document.getElementById("cad-input").value = "";

        navigate("/");
      } else {
        toast.error(data.message || "فشل رفع المشروع ❌");
      }
    } catch (err) {
      console.error("🚨 خطأ في رفع المشروع:", err);
      if (err.name === 'AbortError') {
        toast.error("انتهت مهلة الرفع. الملف كبير جداً أو الاتصال بطيء");
      } else {
        toast.error("حدث خطأ أثناء رفع المشروع ❌");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded mt-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">رفع مشروع جديد</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">عنوان المشروع</label>
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="مثلاً: تصميم مبنى إداري"
            disabled={uploading}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">التصنيف</label>
          <select
            name="category"
            value={project.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={uploading}
          >
            <option value="">-- اختر التصنيف --</option>
            <option value="إدارة مشروعات">إدارة مشروعات</option>
            <option value="استشارات وإشراف">استشارات وإشراف</option>
            <option value="أساسات وتربة">أساسات وتربة</option>
            <option value="إنشاءات وخرسانة">إنشاءات وخرسانة</option>
            <option value="طرق ونقل">طرق ونقل</option>
            <option value="مساحة">مساحة</option>
            <option value="مياه وصرف صحي">مياه وصرف صحي</option>
            <option value="هندسة بيئية وصحية">هندسة بيئية وصحية</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-800">الوصف التفصيلي</label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            rows="5"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="اشرح محتوى المشروع، البرامج المستخدمة، خطوات التنفيذ... بالرجاء كتابة رقم الهاتف أسفل الوصف للتواصل."
            disabled={uploading}
          ></textarea>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm p-3 mt-2 rounded">
            <strong>تنبيه:</strong> من فضلك اكتب رقم هاتفك في نهاية الوصف حتى يتمكن الزوار من التواصل معك بسهولة.
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">صورة المشروع</label>
          <input
            id="image-input"
            type="file"
            name="image"
            accept=".jpg,.jpeg,.png,.webp"    
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={uploading}
            required
          />
          <p className="text-sm text-gray-500 mt-1">الحد الأقصى: 10MB - الأنواع المدعومة: JPG, PNG, WEBP</p>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm p-3 mt-2 rounded">
            <strong>تنبيه:</strong> إذا كنت ترغب في رفع أكثر من صورة، يمكنك دمجها في صورة واحدة (كولاج) قبل الرفع.
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">ملف CAD</label>
          <input
            id="cad-input"
            type="file"
            name="cadFile"
            accept=".dwg,.dxf,.pdf"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={uploading}
            required
          />
          <p className="text-sm text-gray-500 mt-1">الملفات المدعومة: DWG, DXF, PDF (الحد الأقصى: 50MB)</p>
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 text-sm p-3 mt-2 rounded">
            <strong>ملاحظة:</strong> ملفات DWG و DXF مدعومة بالكامل. تأكد من أن الملف سليم وغير تالف.
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm p-3 mt-2 rounded">
          <strong>تنبيه:</strong> يُفضل جمع الرسومات في ملف واحد بصيغة <span className="font-semibold">بي دي إف</span> لتسهيل عرضها وفتحها من قبل الزوار بدون الحاجة لبرامج خاصة.
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 px-6 rounded text-white font-medium transition-colors ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          {uploading ? "جاري الرفع..." : "رفع المشروع"}
        </button>
      </form>
    </div>
  );
};

export default Upload;