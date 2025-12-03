import Link from "next/link";

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <Link
              href={l.href}
              className="text-gray-400 hover:text-white transition-all text-sm"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FooterCol;