import React from "react";
import { FaFacebook, FaWhatsapp, FaLinkedin, FaEnvelope, FaInstagram } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">تواصل معنا</h1>

      <p className="mb-6 text-lg">
        يمكنك التواصل معنا من خلال المنصات التالية، أو الاتصال على الأرقام الموضحة أدناه:
      </p>

      {/* ✅ أيقونات التواصل */}
      <div className="flex gap-6 mb-8 justify-center text-3xl">
        <a
          href="https://wa.me/201203965665"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:scale-110 duration-200"
        >
          <FaWhatsapp title="WhatsApp" />
        </a>

        <a
          href="mailto:kerolesf@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:scale-110 duration-200"
        >
          <FaEnvelope title="Gmail" />
        </a>

        <a
          href="https://www.facebook.com/keroles.farouk.39"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:scale-110 duration-200"
        >
          <FaFacebook title="Facebook" />
        </a>
       <a
       href="https://www.instagram.com/cries_77/?next=%2F"
       target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-110 duration-200"
        style={{ color: "#E1306C" }} // لون إنستجرام
>
  <FaInstagram title="Instagram" />
</a>
        <a
          href="https://www.linkedin.com/in/wael-farouk-733155246/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-900 hover:scale-110 duration-200"
        >
          <FaLinkedin title="LinkedIn" />
        </a>
      </div>

      {/* ✅ رقم الاتصال */}
      <div className="text-center text-sm text-gray-800">
        أو يمكنك الاتصال بنا على الرقم التالي:{" "}
        <a
          href="tel:01203965665"
          className="text-blue-800 font-bold hover:underline"
        >
          01203965665
        </a>
      </div>
    </div>
  );
};

export default Contact;
