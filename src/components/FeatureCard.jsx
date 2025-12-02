const { Check, X } = require("lucide-react");

export default function Feature({ text, disabled }) {
  return (
    <div className="flex items-center gap-3">
      {disabled ? (
        <X className="w-4 h-4 text-gray-500" />
      ) : (
        <Check className="w-4 h-4 text-green-400" />
      )}
      <span className={disabled ? "text-gray-500" : ""}>{text}</span>
    </div>
  )
}