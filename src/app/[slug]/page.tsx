import { Metadata } from "next";

import { adminDb } from "@/firebase/adminDb";
import Client from './client' // This is a Client Component

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
 
export default async function Page({ params }: Props) {
  const { slug } = await params;

  const docSnap = await adminDb.collection("urls").doc(slug).get();

  if (!docSnap.exists) {
    return {}
  }

  const data = docSnap.data();

  return (
    <div>
      <Client params={params} data={{originalUrl: data?.originalUrl}} />
    </div>
  )
}