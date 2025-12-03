function Step({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center">
      {icon}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm mt-2">{desc}</p>
    </div>
  );
}

export default Step;