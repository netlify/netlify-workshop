import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import logoLight from "~/assets/logo-light.svg";

interface Props {
  title: string;
}

export default function Nav(props: Props) {
  const { title } = props;
  return (
    <header>
      <Head>
        <title>{title}</title>
      </Head>
      <nav>
        <Link href="/">
          <Image alt="Netlify logo" height={40} src={logoLight} />
        </Link>
      </nav>
    </header>
  );
}
