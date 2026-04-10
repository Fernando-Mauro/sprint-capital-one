import type { ReactNode } from 'react';

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchDetailPage({
  params,
}: MatchDetailPageProps): Promise<ReactNode> {
  const { id } = await params;

  return (
    <div>
      <h1>Match Detail</h1>
      <p>Match ID: {id}</p>
      {/* TODO: Fetch match data by id and display details, participants, chat */}
    </div>
  );
}
