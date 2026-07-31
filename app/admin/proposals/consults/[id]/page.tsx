import { ConsultRoom } from "@/components/admin/ConsultRoom";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConsultRoomPage({ params }: PageProps) {
  const { id } = await params;
  return <ConsultRoom consultId={id} />;
}
