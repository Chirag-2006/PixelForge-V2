const { default: Image } = require("next/image");

export default function ImageCard({ url, published }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <Image
        width={500}
        height={500}
        alt="Image"
        src={url}
        className="w-full h-60 object-cover"
      />
      <p
        className={`text-xs px-2 py-1 ${
          published ? "text-green-500" : "text-gray-400"
        }`}
      >
        {published ? "Published" : "Private"}
      </p>
    </div>
  );
}