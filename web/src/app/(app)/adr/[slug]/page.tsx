import { DocPage, docMetadata } from "@/components/doc-page";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  return docMetadata("adr", (await params).slug);
}

export default async function Page({ params }: Params) {
  return <DocPage collection="adr" slug={(await params).slug} />;
}
