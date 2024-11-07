import { FaCode } from "react-icons/fa6";

export function CodeLink({
  fileName,
  className,
}: {
  fileName: string;
  className?: string;
}) {
  const href = `https://github.com/joshuahhh/react-animation/blob/main/src/${fileName}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`f-row align-items:center ${className ?? ""}`}
    >
      <FaCode />
    </a>
  );
}
