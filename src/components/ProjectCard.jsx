// src/components/ProjectCard.jsx
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition duration-300 group">
      <div className="w-full h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{project.title}</h2>
        <p className="text-sm text-blue-700 font-medium mt-1">{project.category}</p>
        <p className="text-gray-600 mt-2 line-clamp-3">{project.description}</p>
        <div className="mt-4 text-right">
          <Link
            to={`/project/${project._id}`}
            className="text-blue-600 hover:underline font-semibold"
          >
            عرض التفاصيل →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
