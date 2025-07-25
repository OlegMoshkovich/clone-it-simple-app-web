import LogDetail from '../../../pages/LogDetail';

interface LogDetailPageProps {
  params: {
    id: string;
  };
}

export default function LogDetailPage({ params }: LogDetailPageProps) {
  return <LogDetail logId={params.id} />;
} 