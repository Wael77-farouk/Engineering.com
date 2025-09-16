import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import ProjectCard from "../components/ProjectCard";
import Search from "../components/Search";

const categories = [
  "الكل",
  "إدارة مشروعات",
  "استشارات وإشراف",
  "أساسات وتربة",
  "إنشاءات وخرسانة",
  "طرق ونقل",
  "مساحة",
  "مياه وصرف صحي",
  "هندسة بيئية وصحية"
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { backendUrl } = useContext(ShopContext);

  const location = useLocation();
  const searchInputRef = useRef(null);

  // ✅ Focus على خانة البحث لو جاي من أيقونة البحث
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const shouldFocusSearch = queryParams.get('focus') === 'search';

    if (shouldFocusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [location]);

  // ✅ جلب المشاريع المعتمدة
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/projects/approved`)
      .then((res) => {
        console.log("✅ المشاريع:", res.data.data);
        setProjects(res.data.data);
      })
      .catch((err) => {
        console.error("❌ فشل في جلب المشاريع", err);
      });
  }, [backendUrl]);

  // ✅ فلترة المشاريع حسب التصنيف والبحث
  const filteredProjects = Array.isArray(projects)
    ? projects.filter((p) => {
        const inCategory =
          selectedCategory === "الكل" || p.category === selectedCategory;

        const inSearch =
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase());

        return inCategory && inSearch;
      })
    : [];

  return (
    <div className="p-4">
      <section className="text-center my-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          منصة مشاريع الهندسة المدنية
        </h1>
        <p className="text-gray-600">
          استعرض وشارك مشاريعك في مختلف تخصصات الهندسة المدنية
        </p>

        {/* 🔍 خانة البحث */}
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          inputRef={searchInputRef}
        />

        {/* 🧭 التصنيفات */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat
                  ? "bg-blue-800 text-white"
                  : "bg-white text-blue-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 📦 عرض المشاريع */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        ) : searchTerm !== "" ? (
          <p className="text-center col-span-full text-red-500">
            لا توجد نتائج لكلمة البحث "<strong>{searchTerm}</strong>"
          </p>
        ) : (
          <p className="text-center col-span-full text-gray-500">
            لا توجد مشاريع في هذا القسم حاليًا
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="text-center mt-12">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          هل لديك مشروع تريد مشاركته؟
        </h2>
        <a
          href="/upload"
          className="inline-block bg-blue-700 hover:bg-blue-900 text-white px-6 py-3 rounded-full transition"
        >
          ابدأ مشاركتك الآن
        </a>
      </section>
    </div>
  );
};

export default Home;
