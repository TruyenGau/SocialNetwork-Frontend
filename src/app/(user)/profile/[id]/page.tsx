// app/(user)/profile/[id]/page.tsx
import ProfileDetail from '@/components/profile/profilr.detail';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ProfileDetail userId={id} />;
}
