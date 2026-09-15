import { DocPage, docMetadata } from "@/components/doc-page";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  return docMetadata("docs", (await params).slug);
}

export default async function Page({ params }: Params) {
  return <DocPage collection="docs" slug={(await params).slug} />;
}
