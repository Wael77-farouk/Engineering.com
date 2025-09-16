import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-12 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-center md:text-right">
        
        {/* القسم 1: عن المنصة */}
        <div>
          <h3 className="text-lg font-bold mb-2">منصة المشاريع المدنية</h3>
          <p className="text-gray-300 leading-6">
            منصة لعرض ومشاركة مشاريع طلاب وخريجي الهندسة المدنية. هدفنا توثيق الأعمال وتبادل المعرفة.
          </p>
        </div>

        {/* القسم 2: روابط سريعة */}
        <div>
          <h4 className="text-lg font-bold mb-2">روابط</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-yellow-300">الرئيسية</Link></li>
            <li><Link to="/upload" className="hover:text-yellow-300">رفع مشروع</Link></li>
            <li><Link to="/profile" className="hover:text-yellow-300">مشاريعي</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-300">تواصل معنا</Link></li>
          </ul>
        </div>

        {/* القسم 3: حقوق واسم المطور */}
        <div className="flex flex-col justify-between items-center md:items-end text-gray-400">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
          <p>تطوير: <span className="text-yellow-300">Wael Farouk Adeeb</span></p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
