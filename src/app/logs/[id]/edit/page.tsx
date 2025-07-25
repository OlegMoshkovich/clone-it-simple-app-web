import CreateLog from '../../../../pages/CreateLog';
import { EditLogPageProps } from '../../../../types';

export default function EditLogPage({ params }: EditLogPageProps) {
  return <CreateLog logId={params.id} />;
} 