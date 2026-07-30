import { Table, TableRow, TableCell } from '../components/Table';
import { Button } from '../components/Button';

export function Subscriptions() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">اشتراک‌ها</h1>
        <Button>افزودن اشتراک</Button>
      </div>

      <Table columns={['شناسه', 'کاربر', 'پلان', 'وضعیت', 'انقضا', 'عملیات']}>
        <TableRow>
          <TableCell dir="ltr">sub_123</TableCell>
          <TableCell>ادمین سیستم</TableCell>
          <TableCell>Pro Plan</TableCell>
          <TableCell><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">ACTIVE</span></TableCell>
          <TableCell>1403/12/29</TableCell>
          <TableCell>
            <Button variant="secondary" className="text-sm px-2 py-1">مدیریت</Button>
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
}
