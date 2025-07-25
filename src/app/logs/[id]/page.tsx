import LogDetail from '../../../pages/LogDetail';
import { LogDetailPageProps } from '../../../types';

export default function LogDetailPage({ params }: LogDetailPageProps) {
  return <LogDetail logId={params.id} />;
} 