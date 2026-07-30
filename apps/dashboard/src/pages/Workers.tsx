import { Table, TableRow, TableCell } from '../components/Table';

export function Workers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ورکرها</h1>
      </div>

      <Table columns={['نام', 'محیط', 'نسخه', 'وضعیت', 'بررسی سلامت']}>
        <TableRow>
          <TableCell dir="ltr">auth-worker</TableCell>
          <TableCell>Production</TableCell>
          <TableCell dir="ltr">v1.2.0</TableCell>
          <TableCell><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">ONLINE</span></TableCell>
          <TableCell>2 دقیقه پیش</TableCell>
        </TableRow>
      </Table>
    </div>
  );
}
