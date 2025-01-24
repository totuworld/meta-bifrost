import { adminDb } from "@/firebase/adminDb";
import { redirect } from "next/navigation";
import { Metadata } from "next";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const docSnap = await adminDb.collection("urls").doc(slug).get();

  if (!docSnap.exists) {
    return {
      title: "URL Not Found",
    };
  }

  const data = docSnap.data();
  return {
    title: data?.title,
    openGraph: {
      title: data?.title,
      ...(data?.description && { description: data.description }),
      ...(data?.image && { images: [data.image] }),
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const docSnap = await adminDb.collection("urls").doc(slug).get();

  if (!docSnap.exists) {
    return <div className="text-center py-20">URL not found</div>;
  }

  const data = docSnap.data();
  redirect(data?.originalUrl);
}