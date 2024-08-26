import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto flex w-full items-center justify-center border-t border-border pt-8">
      <p>
        Desarrollado por{" "}
        <Link
          className="font-semibold text-primary underline decoration-transparent transition-colors duration-200 hover:decoration-inherit"
          href={"https://spagnolo-carlos.netlify.app/"}
          target="_blank"
        >
          Carlos Andrés Spagnolo
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
