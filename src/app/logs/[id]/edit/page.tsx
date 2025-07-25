import CreateLog from '../../../../pages/CreateLog';

interface EditLogPageProps {
  params: {
    id: string;
  };
}

export default function EditLogPage({ params }: EditLogPageProps) {
  return <CreateLog logId={params.id} />;
} 