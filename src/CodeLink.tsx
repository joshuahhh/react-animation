import { FaExternalLinkAlt } from "react-icons/fa";

export function CodeLink({ href }: { href: string }) {
  return <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaExternalLinkAlt />
  </a>;
}
