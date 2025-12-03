import { HelpCircle } from "lucide-react";

function FAQ({ q, a }) {
  return (
    <details className="border-b py-4 cursor-pointer group">
      <summary className="font-semibold text-lg flex items-center justify-between">
        {q}
        <HelpCircle className="w-5 h-5 opacity-50 transition-all" />
      </summary>
      <p className="text-gray-600 mt-3 ml-1">{a}</p>
    </details>
  );
}

export default FAQ;