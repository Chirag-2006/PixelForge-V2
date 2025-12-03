export default function FeatureCard({ icon, title, desc }) {
  return (
    <div
      className="
        bg-white border border-gray-200 rounded-2xl p-6 shadow-sm 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300
      "
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
