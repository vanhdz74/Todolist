import { useEffect } from "react";

type Props = {
  title: string;
  description?: string;
};

const PageMeta = ({ title, description }: Props) => {
  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.content = description ?? "";
  }, [description, title]);

  return null;
};

export default PageMeta;
